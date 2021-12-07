<template>
  <div>
      <q-input outlined v-model="pizzaName" label="Pizza sort" /><br>
      <q-input outlined v-model="numberOfPizzas" label="Antal pizzor"/><br>
      <q-btn label="Skicka" @click="submit"/>
  </div>
</template>

<script>
import { db } from '../boot/firebase.js'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      pizzaName: '',
      numberOfPizzas: 0
    }
  },
  methods: {
    submit () {
      const order = {
        id: '',
        pizza: this.pizzaName,
        amount: this.numberOfPizzas,
        userId: this.currentUser.id,
        userName: this.currentUser.firstName + ' ' + this.currentUser.lastName,
        status: 'skickad'
      }

      db.collection('orders').add(order).then(res => {
        console.log('Order skickad')
        this.$router.push('/our-orders')
      })
    }
  },
  computed: {
    ...mapGetters('user', ['currentUser'])
  }
}
</script>

<style>

</style>
