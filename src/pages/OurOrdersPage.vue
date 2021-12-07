<template>
<div>
    <q-list class="block" bordered separator>
      <q-item v-for="(order, index) in orders" :key="index">
        <q-item-section>
            {{order.name}}
        </q-item-section>

        <q-item-section>
            {{order.userName}}
        </q-item-section>

        <q-item-section>
            {{order.pizza}} - {{order.amount}}
        </q-item-section>

        <q-item-section>
            {{order.status}} <q-btn label="Mottagen" color="primary" @click="mottagen(order.id)"/>
        </q-item-section>
      </q-item>
    </q-list>
</div>
</template>

<script>
import { db } from '../boot/firebase.js'
export default {
  data () {
    return {
      orders: []
    }
  },
  methods: {
    mottagen (value) {
      db.collection('orders').doc(value).update({ status: 'mottagen' }).then(res => {
        console.log('uppdaterad!')
      })
    }
  },
  firestore: {
    orders: db.collection('orders')
  }
}
</script>

<style>

</style>
