<template>
  <q-card style="width: 350px; max-width: 80vw;" class="bg-grey-3">
    <q-card-section>
      <span class="text-center block text-h5 text-grey-7 q-mb-sm">Återställning</span>
      <q-form ref="reset_form" greedy>
        <div class="column q-gutter-y-sm">
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

          <div class="q-mt-md row justify-between">
            <q-btn type="submit" color="green-5" label="Återställ lösenord" no-caps class="full-width" unelevated />
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
export default {
  name: 'reset-password-component',
  props: {
    mode: { type: Number, required: true }
  },
  data () {
    return {
      email: '',
      validInputs: true,
      // eslint-disable-next-line
      email_test: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    }
  },
  methods: {
    onSubmit () {
      this.validInputs = false
      this.$refs.reset_form.validate()
        .then(async success => {
          if (success) {
            this.validInputs = true

            try {
              await this.$fb.auth().sendPasswordResetEmail(this.email)
              this.$q.notify({
                color: 'primary',
                message: 'Ett återställningsmejl har skickats till den e-post som du registrerat.'
              })
            } catch (err) {
              this.$q.notify({
                color: 'negative',
                message: `Ett fel har uppstått: ${err}`
              })
            }
          }
        })
    },
    testRules (test, value) {
      return test.test(value) || this.validInputs
    },
    testRulesClass (test, value) {
      return (test.test(value) || this.validInputs) ? '' : ''
    }
  }
}
</script>
