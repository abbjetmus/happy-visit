<template>
<q-page>
  <div class="row">
    <div class="col-10 column">
      <div class="row justify-center q-mt-xl">
          <div class="text-center">
              <div class="text-h2">Välkommmen till Happy <q-avatar>
                <img
                  src="../assets/emoji_happy.svg"
                  style="width:50px; height:50px;"
                /> </q-avatar> Visit</div>
                <q-separator class="q-my-md"></q-separator>
              <div class="text-h5 text-grey-8">Applikationen som mäter hur ni känner er idag</div>
          </div>
      </div>

      <div class="row justify-center text-center q-mt-lg">
        <q-select color="orange" dense style="width:200px; padding: 0px;" outlined v-model="selectedOption" :options="happydays" :option-value="(item) => item === null ? null : item.date" :option-label="(item) => item === null ? null : item.date"/>
      </div>

      <div class="row justify-center q-mt-lg">
          <happy-chart-component :currentdate="selectedOption.date"></happy-chart-component>
      </div>

      <div class="text-center q-mt-xl">
          <q-btn v-if="isAuthenticated" color="green" @click="goToTodaysVote" label="Rösta i dagens mätning"></q-btn>
          <div v-else class="text-h5 text-grey-8">
            <q-btn color="green" @click="showSignInSignUpDialog" no-caps unelevated>Logga in / Skapa konto</q-btn><span> för att kunna rösta i mätningarna</span>
          </div>
      </div>
    </div>

    <div class="col-2 q-px-md" style="border-left: solid grey 1px;">
      <message-list-component :currentDate="currentDate"></message-list-component>
    </div>

    <sign-in-sign-up-dialog :show.sync="signInSignUpDialog"></sign-in-sign-up-dialog>
  </div>
</q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { db } from '../boot/firebase.js'
import { date } from 'quasar'

export default {
  name: 'index',
  data () {
    return {
      happydays: [],
      selectedOption: { date: date.formatDate(Date.now(), 'YYYY-MM-DD') },
      currentDate: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      signInSignUpDialog: false
    }
  },
  components: {
    HappyChartComponent: () => import('../components/HappyChartComponent.vue'),
    MessageListComponent: () => import('../components/MessageListComponent.vue'),
    SignInSignUpDialog: () => import('../dialogs/SignInSignUpDialog.vue')
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  },
  methods: {
    goToTodaysVote () {
      this.$router.push('vote')
    },
    showSignInSignUpDialog () {
      this.signInSignUpDialog = true
    }
  },
  watch: {
    selectedOption: {
      immediate: true,
      handler (value) {
        this.currentDate = value.date
      }
    }
  },
  firestore: {
    happydays: db.collection('happydays')
  }
}
</script>
<style lang="sass">
.my-emoticon
  vertical-align: middle
  height: 2em
  width: 2em
</style>
