<template>
<q-page class="column justify-center items-center">
    <div>
  <QFirebaseUploaderBase
    label="Upload photos"
    @upload="addImage"
    multiple/>
    </div>

    <q-list class="block" bordered separator>
      <q-item v-for="(image, index) in images" :key="index">
        <q-item-section>
            <img width="200" height="200" :src="image.url" />
        </q-item-section>
      </q-item>
    </q-list>
</q-page>
</template>
<script>
import { db } from '../boot/firebase.js'
import { mapGetters } from 'vuex'
export default {
  components: {
    QFirebaseUploaderBase: () => import('../components/QFirebaseUploaderBase.vue')
  },
  data () {
    return {
      images: []
    }
  },
  methods: {
    addImage (item) {
      console.log(item)

      db.collection('users').doc(this.currentUser.id).collection('images').add(item).then(result => {
        console.log('Bild tillagd på användare: ' + this.currentUser.firstName)
      })
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  },
  watch: {
    currentUser: {
      // call it upon creation too
      immediate: true,
      handler (user) {
        if (user) {
          this.$bind('images', db.collection('users').doc(user.id).collection('images'))
        }
      }
    }
  }
}
</script>
