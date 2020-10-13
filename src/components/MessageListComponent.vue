<template>
  <q-scroll-area style="height: 100%;">
    <div v-for="(vote, index) in voters" :key="index" class="caption">
      <q-chat-message
      size="12"
        :name="vote.name"
        sent
        :stamp="vote.time">
          <img :src="getIcon(vote.icon)" class="my-emoticon">
        </q-chat-message>
    </div>
  </q-scroll-area>
</template>

<script>
import { db } from '../boot/firebase.js'

export default {
  name: 'message-list-component',
  props: ['currentDate'],
  data () {
    return {
      voters: []
    }
  },
  methods: {
    onLoad (index, done) {
      done()
    },
    getIcon (icon) {
      return `/icons/${icon}.svg`
    }
  },
  watch: {
    currentDate: {
      // call it upon creation too
      immediate: true,
      handler (date) {
        this.$bind('voters', db.collection('happydays').doc(date).collection('voters'))
      }
    }
  }
}
</script>
