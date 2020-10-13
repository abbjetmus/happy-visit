import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import firebaseService from '../services/firebase'

let db
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
  increment = firebase.firestore.FieldValue.increment(1)
}

export { db, increment }
