<template>
  <q-dialog v-model="dialogShow" @before-hide="cancel">
    <sign-in-component v-if="mode === 1" :mode.sync="mode" @cancel="cancel"></sign-in-component>
    <sign-up-component v-if="mode === 2" :mode.sync="mode" @cancel="cancel"></sign-up-component>
    <reset-password-component v-if="mode === 3" :mode.sync="mode" @cancel="cancel"></reset-password-component>
  </q-dialog>
</template>

<script>
export default {
  name: 'sign-in-sign-up-dialog',
  components: {
    SignUpComponent: () => import('../components/SignUpComponent'),
    SignInComponent: () => import('../components/SignInComponent'),
    ResetPasswordComponent: () => import('../components/ResetPasswordComponent')
  },
  props: {
    show: { type: Boolean, required: true },
    toReturnAfterCancel: { type: String, required: false }
  },
  data () {
    return {
      dialogShow: false,
      mode: 1 // 1 = signin, 2 = signup, 3 = reset
    }
  },
  methods: {
    cancel () {
      this.dialogShow = false
      this.mode = 1
      this.$emit('update:show', this.dialogShow)
      this.$emit('returnAfterCancel', this.toReturnAfterCancel)
    }
  },
  watch: {
    show: function (val) {
      this.dialogShow = val
    }
  }
}
</script>
