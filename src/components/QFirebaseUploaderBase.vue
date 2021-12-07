<script>
import { QUploaderBase } from 'quasar'
import { storage } from '../boot/firebase.js'
import uuid from 'uuid/v4'
export default {
  mixins: [QUploaderBase],
  props: {
    metadata: Object
  },
  data () {
    return {
      progressUpload: 0,
      file: File,
      uploadTask: ''
    }
  },
  methods: {
    upload () {
      this.files.forEach(file => {
        const ref = 'media/' + uuid()
        const uploadTask = storage
          .ref()
          .child(ref)
          .put(file, this.metadata)
        uploadTask.on(
          'state_changed',
          sp => {
            this.uploadSize = sp.totalBytes
            this.uploadedSize = sp.bytesTransferred
          },
          null,
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              this.$emit('upload', {
                url: downloadURL,
                id: ref,
                name: file.name,
                size: file.size,
                uploadedDate: new Date(),
                lastModified: file.lastModified,
                description: ''
              })
              this.removeFile(file)
            })
          }
        )
      })
    }
  }
}
</script>
