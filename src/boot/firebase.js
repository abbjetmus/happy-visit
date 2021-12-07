import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseService from '../services/firebase'
import 'firebase/storage'

let db
let storage
let increment

export default ({ store, Vue }) => {
  Vue.use(firestorePlugin)

  const config = process.env.firebaseConfig
  firebaseService.fBInit(config)

  // Tell the application what to do when the
  // authentication state has changed
  firebaseService.auth().onAuthStateChanged((user) => {
    firebaseService.handleOnAuthStateChanged(store, user)
  }, (error) => {
    console.error(error)
  })

  Vue.prototype.$fb = firebaseService
  store.$fb = firebaseService

  db = firebase.firestore()
  storage = firebase.storage()
  increment = firebase.firestore.FieldValue.increment(1)
}

export { db, increment, storage }
