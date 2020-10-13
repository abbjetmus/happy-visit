<template>
  <q-page class="column q-col-gutter-md">
    <div class="text-center col-sm-3 col-md-1 col-lg-2">
      <span class="block text-h2 q-mt-md">Hur känner du dig idag?</span>
      <span v-if="hasVotedToday" class="block text-h6 text-green">Du har röstat idag!</span>
    </div>

    <div class="row justify-around items-center col q-col-gutter-md">
      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_happy" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_happy.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_neutral" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_neutral.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_sad" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_sad.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_heart_eyes" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_heart_eyes.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_alien" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_alien.svg">
        </emoji-button-component>
      </div>
    </div>

    <div class="row justify-around items-top col q-col-gutter-md">
      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_angry" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_angry.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_clown" @emojiClicked="clickedEmoji">
          <img style="height:200px; width: 160px;" src="../assets/emoji_clown.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_silly" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_silly.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_cry" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_cry.svg">
        </emoji-button-component>
      </div>

      <div :class="dynamicColClass">
        <emoji-button-component :emoji="emoji_excited" @emojiClicked="clickedEmoji">
          <img style="height:160px; width: 160px;" src="../assets/emoji_excited.svg">
        </emoji-button-component>
      </div>

    </div>
  </q-page>
</template>

<script>
import { db, increment } from '../boot/firebase.js'
import { mapGetters } from 'vuex'
import { date } from 'quasar'
const happydays = db.collection('happydays')

export default {
  name: 'happy-visit-page',
  components: {
    EmojiButtonComponent: () => import('../components/EmojiButtonComponent.vue')
  },
  data () {
    return {
      currentDate: date.formatDate(Date.now(), 'YYYY-MM-DD'),
      emoji_happy: 'emoji_happy',
      emoji_neutral: 'emoji_neutral',
      emoji_sad: 'emoji_sad',
      emoji_alien: 'emoji_alien',
      emoji_cry: 'emoji_cry',
      emoji_heart_eyes: 'emoji_heart_eyes',
      emoji_clown: 'emoji_clown',
      emoji_excited: 'emoji_excited',
      emoji_silly: 'emoji_silly',
      emoji_angry: 'emoji_angry',
      hasVotedToday: false
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser']),
    dynamicColClass () {
      return this.$q.screen.lt.md ? 'col-auto' : 'col-auto'
    }
  },
  watch: {
    currentUser: {
      // call it upon creation too
      immediate: true,
      handler (user) {
        if (user != null) {
          happydays.doc(this.currentDate).collection('voters').doc(user.id).get()
            .then((snapshot) => {
              this.hasVotedToday = !!snapshot.exists
            })
            .catch(err => { console.error(err) })
        }
      }
    }
  },
  methods: {
    clickedEmoji (value) {
      if (this.hasVotedToday !== true) {
        let update
        let icon
        const time = date.formatDate(Date.now(), 'HH:mm')
        switch (value) {
          case 'emoji_happy':
            update = { happy: increment }
            icon = 'emoji_happy'
            break
          case 'emoji_neutral':
            update = { neutral: increment }
            icon = 'emoji_neutral'
            break
          case 'emoji_sad':
            update = { sad: increment }
            icon = 'emoji_sad'
            break
          case 'emoji_alien':
            update = { alien: increment }
            icon = 'emoji_alien'
            break
          case 'emoji_cry':
            update = { cry: increment }
            icon = 'emoji_cry'
            break
          case 'emoji_heart_eyes':
            update = { heart_eyes: increment }
            icon = 'emoji_heart_eyes'
            break
          case 'emoji_clown':
            update = { clown: increment }
            icon = 'emoji_clown'
            break
          case 'emoji_excited':
            update = { excited: increment }
            icon = 'emoji_excited'
            break
          case 'emoji_silly':
            update = { silly: increment }
            icon = 'emoji_silly'
            break
          case 'emoji_angry':
            update = { angry: increment }
            icon = 'emoji_angry'
            break
          default:
            break
        }
        happydays.doc(this.currentDate).update(update).then(result => {
          happydays.doc(this.currentDate).collection('voters').doc(this.currentUser.id).set({ id: this.currentUser.id, name: `${this.currentUser.firstName} ${this.currentUser.lastName}`, time: time, icon: icon }).then(res => {
            this.hasVotedToday = true
          })
        })
        this.$q.notify({
          message: 'Tack för ditt svar!',
          color: 'green'
        })
      }
    },
    scheduleHappyDay (time, triggerThis) {
      // get hour and minute from hour:minute param received, ex.: '16:00'
      const hour = Number(time.split(':')[0])
      const minute = Number(time.split(':')[1])

      // create a Date object at the desired timepoint
      const startTime = new Date(); startTime.setHours(hour, minute)
      const now = new Date()

      // increase timepoint by 24 hours if in the past
      if (startTime.getTime() < now.getTime()) {
        startTime.setHours(startTime.getHours() + 24)
      }

      // get the interval in ms from now to the timepoint when to trigger the alarm
      const firstTriggerAfterMs = startTime.getTime() - now.getTime()

      // trigger the function triggerThis() at the timepoint
      // create setInterval when the timepoint is reached to trigger it every day at this timepoint
      setTimeout(function () {
        triggerThis()
        setInterval(triggerThis, 24 * 60 * 60 * 1000)
      }, firstTriggerAfterMs)
    }
  }
}
</script>
