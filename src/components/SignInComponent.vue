<template>
  <q-card style="width: 350px; max-width: 80vw;" class="bg-grey-3">
    <q-card-section>
      <span class="text-center block text-h5 text-grey-7 q-mb-sm">Inloggning</span>
      <span v-if="authError" class="text-red">{{authErrorMessage}}</span>
      <q-form ref="signup_form" @submit.prevent="onSubmit" greedy>
        <div class="column q-gutter-y-sm">
          <span v-if="!validInputs" class="text-red text-center">E-post eller lösenord matchar inget konto</span>
          <q-input
            dense
            no-error-icon
            hide-bottom-space
            v-model="email"
            bg-color="white"
            class="q-pa-none"
            outlined
            :rules="[v => testRules(email_test, v)]"
            placeholder="E-post" />

          <q-input
            dense
            no-error-icon
            hide-bottom-space
            v-model="password"
            bg-color="white"
            class="q-pa-none"
            outlined
            :type="isPassword ? 'password' : 'text'"
            :rules="[v => testRules(password_test, v)]"
            placeholder="Lösenord">
            <template v-slot:append>
              <q-icon @click="isPassword = !isPassword" :name="isPassword ? 'visibility_off' : 'visibility'"></q-icon>
            </template>
          </q-input>

          <div class="q-mt-sm row justify-between">
            <q-btn  dense label="Glömt lösenordet?" @click="$emit('update:mode', 3)" color="grey-8" class="text-subtitle1" no-caps flat />

            <q-btn  type="submit" color="green-5" label="Logga in" no-caps unelevated />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-separator/>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-center text-grey-8">Saknar du konto? <q-btn color="green-6" flat no-caps dense @click="$emit('update:mode', 2)">Skapa konto</q-btn></div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'sign-in-component',
  props: {
    mode: { type: Number, required: true }
  },
  data () {
    return {
      authError: false,
      authErrorMessage: '',
      email: '',
      password: '',
      isPassword: true,
      validInputs: true,
      // eslint-disable-next-line
      email_test: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
      // eslint-disable-next-line
      password_test: /^([a-zA-Z0-9"]{8,15})$/
    }
  },
  computed: {
    ...mapGetters('auth', ['token'])
  },
  methods: {
    ...mapActions('auth', ['loginUser', 'loginWithFacebook', 'loginWithGoogle']),
    cancel () {
      this.email = ''
      this.password = ''
    },
    onSubmit () {
      this.validInputs = false
      const { email, password } = this
      this.$refs.signup_form.validate()
        .then(async success => {
          if (success) {
            this.validInputs = true

            this.loginUser({ email, password }).then(result => {
              this.$emit('cancel')
            }).catch(error => {
              if (error.code === 'auth/wrong-password') {

              } else {
                this.authError = true
                this.authErrorMessage = 'Felaktig e-post eller lösenord.'
              }

              console.error('Email-Password login:', error)
            })
          } else {
            this.validInputs = false
          }
        }).catch(error => {
          this.validInputs = false
          console.error(error)
        })
    },
    testRules (test, value) {
      return test.test(value) || this.validInputs
    }
  }
}
</script>
