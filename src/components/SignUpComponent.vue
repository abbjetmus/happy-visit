<template>
  <q-card style="width: 350px; max-width: 80vw;" class="bg-grey-3">
    <q-card-section>
      <span class="text-center block text-h5 text-grey-7 q-mb-sm">Nytt konto</span>
      <span v-if="authError" class="text-red">{{authErrorMessage}}</span>
      <q-form ref="signup_form" @submit="onSubmit" greedy>
        <div class="column q-gutter-y-sm">
          <q-input
            dense
            no-error-icon
            hide-bottom-space
            v-model="firstName"
            bg-color="white"
            :class="testRulesClass(name_test, firstName)"
            class="q-pa-none"
            outlined
            :rules="[v => testRules(name_test, v) || 'Inte ett giltigt förnamn']"
            placeholder="Förnamn" />

          <q-input
            dense
            no-error-icon
            hide-bottom-space
            v-model="lastName"
            bg-color="white"
            :class="testRulesClass(name_test, lastName)"
            class="q-pa-none"
            outlined
            :rules="[v => testRules(name_test, v) || 'Inte ett giltigt efternamn']"
            placeholder="Efternamn" />

          <q-input
            dense
            no-error-icon
            hide-bottom-space
            v-model="email"
            bg-color="white"
            class="q-pa-none"
            outlined
            :class="testRulesClass(email_test, email)"
            :rules="[v => testRules(email_test, v)  || 'Inte en giltig e-post']"
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
            :class="matchPasswordTestRuleClass(password)"
            :rules="[v => matchPasswordTestRule(v) || 'Inte ett giltigt lösenord eller matchar inte med upprepad lösenord']"
            placeholder="Lösenord">
            <template v-slot:prepend>
              <q-icon name="info">
                <q-tooltip>Lösenord måste vara minst 8 tecken med små och STORA bostäver samt minst ett specialtecken @*#!</q-tooltip>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon @click="isPassword = !isPassword" :name="isPassword ? 'visibility_off' : 'visibility'" />
            </template>
          </q-input>

          <q-input
            dense
            no-error-icon
            hide-bottom-space
            v-model="rewritePassword"
            bg-color="white"
            class="q-pa-none"
            outlined
            :type="isPassword ? 'password' : 'text'"
            :class="matchPasswordRewriteTestRuleClass(rewritePassword)"
            :rules="[v => matchPasswordRewriteTestRule(v) || 'Inte ett giltigt upprepad lösenord eller matchar inte med lösenord']"
            placeholder="Upprepa lösenord">
            <template v-slot:prepend>
              <q-icon name="info">
                <q-tooltip>Upprepad lösenord måste vara minst 8 tecken med små och STORA bostäver samt minst ett specialtecken @*#!</q-tooltip>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon @click="isPassword = !isPassword" :name="isPassword ? 'visibility_off' : 'visibility'" />
            </template>
          </q-input>

          <div class="q-mt-md row justify-between">
            <q-btn
              type="submit"
              color="green-5"
              label="Skapa konto"
              no-caps
              class="full-width"
              :loading="loading"
              unelevated />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <div class="q-px-md">
      <q-separator />
    </div>

    <q-card-section>
      <div class="text-center text-grey-8">Gå till <q-btn color="green-6" flat no-caps dense @click="$emit('update:mode', 1)">inloggning</q-btn>!</div>
    </q-card-section>

  </q-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'sign-up-dialog',
  props: {
    mode: { type: Number, required: true }
  },
  data () {
    return {
      loading: false,
      email: '',
      password: '',
      rewritePassword: '',
      firstName: '',
      lastName: '',
      validInputs: true,
      isPassword: true,
      // eslint-disable-next-line
      name_test: /^[a-zA-zäöåÄÖÅ,.'-]+$/,      
      // eslint-disable-next-line
      email_test: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
      // eslint-disable-next-line
      password_test: /^([a-zA-Z0-9!@#$&()\\-`.+,/\"]{8,15})$/,
      authError: false,
      authErrorMessage: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['token'])
  },
  methods: {
    ...mapActions('auth', ['createNewUser', 'sendEmailVerification']),
    onSubmit () {
      const { email, password, firstName, lastName } = this
      this.validInputs = false
      this.$refs.signup_form.validate()
        .then(async success => {
          if (success) {
            this.loading = true
            this.createNewUser({ email, password, firstName, lastName }).then(result => {
              this.sendEmailVerification().then(result => {
                // Email Verification sent.
                this.$emit('cancel')
              })
            }).catch(error => {
              if (error.code === 'auth/email-already-in-use') {
              } else {
                this.authError = true
                this.authErrorMessage = 'Kunde inte logga in.'
              }
              console.error(error)
              this.loading = false
            })
          }
        })
    },
    testRules (test, value) {
      return test.test(value) || this.validInputs
    },
    testRulesClass (test, value) {
      return (test.test(value) || this.validInputs) ? '' : ''
    },
    matchPasswordTestRule (value) {
      return (this.password_test.test(value) && value === this.rewritePassword) || this.validInputs
    },
    matchPasswordTestRuleClass (value) {
      return ((this.password_test.test(value) && value === this.rewritePassword) || this.validInputs) ? '' : ''
    },
    matchPasswordRewriteTestRule (value) {
      return (this.password_test.test(value) && value === this.password) || this.validInputs
    },
    matchPasswordRewriteTestRuleClass (value) {
      return ((this.password_test.test(value) && value === this.password) || this.validInputs) ? '' : ''
    }
  }
}
</script>
