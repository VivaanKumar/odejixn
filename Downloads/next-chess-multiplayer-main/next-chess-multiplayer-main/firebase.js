import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCYbvk-DZOSL5X4cKClw2yv3XxmKAm_Sj4",
  authDomain: "vivchess-c5c0c.firebaseapp.com",
  projectId: "vivchess-c5c0c",
  storageBucket: "vivchess-c5c0c.appspot.com",
  messagingSenderId: "396950179165",
  appId: "1:396950179165:web:89afb43900f02bfdc96cb4"
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

export { db, provider, auth };
