<template>
  <q-btn-dropdown color="grey-3" outline class="text-center q-pa-none" no-caps unelevated auto-close>

    <template v-slot:label>
      <div class="row justify-center items-center q-pa-none">
        <q-icon :left="screenGtXs" color="grey-3" name="account_circle" />
        <span v-if="screenGtXs" class="text-center">{{user.firstName}}</span>
      </div>
    </template>

    <q-list class="q-pa-none q-ma-none text-center">
      <q-item clickable>
        <q-item-section @click="goToStart">Start</q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section @click="goToVote">Rösta i dagens mätning</q-item-section>
      </q-item>

      <q-separator></q-separator>

      <q-item clickable>
        <q-item-section @click="logoutUser">Logga ut</q-item-section>
      </q-item>

    </q-list>

  </q-btn-dropdown>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'toolbar-user-menu-component',
  props: {
    user: { type: Object, required: true }
  },
  computed: {
    screenGtXs () {
      return this.$q.screen.gt.xs
    }
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    goToStart () {
      // eslint-disable-next-line handle-callback-err
      this.$router.push('/').catch(err => {})
    },
    goToVote () {
      // eslint-disable-next-line handle-callback-err
      this.$router.push('vote').catch(err => {})
    }
  }
}
</script>
