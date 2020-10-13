<template>
<div class="background-button relative-position">
  <q-btn round class="shadow-3 absolute-center bg-grey-5" @click="updateEmojiCounter">
    <q-avatar square size="200px">
        <slot></slot>
    </q-avatar>
  </q-btn>
</div>
</template>

<script>
export default {
  name: 'emoji-button-component',
  props: {
    emoji: { type: String, required: true }
  },
  methods: {
    updateEmojiCounter () {
      const audio = new Audio('/click_on.mp3')
      audio.play()
      this.$emit('emojiClicked', this.emoji)
    }
  }
}
</script>

<style scoped>
.background-button {
  background-color: grey;
  height: 230px;
  width: 230px;
  border-radius: 50%;
}
</style>
