<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="text-white bg-indigo-5 q-py-none q-my-none">
      <q-toolbar class="q-px-sm">
        <q-toolbar-title>
          <router-link
            to="/"
            class="text-h5 text-grey-3 q-ml-sm"
            style="text-decoration: none;"
            >Happy
            <q-avatar>
              <img
                src="../assets/emoji_happy.svg"
                style="width:28px; height:28px;"
              />
            </q-avatar>
            Visit
          </router-link>
        </q-toolbar-title>

        <div class="row q-pa-none items-center">
        <toolbar-user-menu-component v-if="isAuthenticated && currentUser" :user="currentUser"></toolbar-user-menu-component>
        <q-btn
          v-else
          unelevated
          color="green-5"
          text-color="white"
          class="q-ml-sm q-pa-none"
          no-caps
          @click="showSignInSignUpDialog">Logga in / Skapa
          konto</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <sign-in-sign-up-dialog :show.sync="signInSignUpDialog"></sign-in-sign-up-dialog>
  </q-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { date } from 'quasar'
import { db } from '../boot/firebase.js'

function triggerHappyDay () {
  const currentDate = date.formatDate(Date.now(), 'YYYY-MM-DD')
  db.collection('happydays').doc(currentDate).get()
    .then((docSnapshot) => {
      if (!docSnapshot.exists) {
        db.collection('happydays').doc(currentDate).set({
          alien: 0,
          angry: 0,
          clown: 0,
          cry: 0,
          excited: 0,
          happy: 0,
          heart_eyes: 0,
          neutral: 0,
          sad: 0,
          silly: 0,
          date: currentDate
        })
      }
    })
}

export default {
  name: 'MainLayout',
  components: {
    SignInSignUpDialog: () => import('../dialogs/SignInSignUpDialog.vue'),
    ToolbarUserMenuComponent: () => import('../components/ToolbarUserMenuComponent.vue')
  },
  created () {
    const currentDate = date.formatDate(Date.now(), 'YYYY-MM-DD')
    this.setCurrentDate(currentDate)
    triggerHappyDay()
  },
  data () {
    return {
      signInSignUpDialog: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    ...mapMutations('settings', ['setCurrentDate']),
    showSignInSignUpDialog () {
      this.signInSignUpDialog = true
    }
  }
}
</script>
