// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADOuBexxfV7EFYR3Vt5tC-X8NMPCp8SPM",
  authDomain: "fleet-mongo.firebaseapp.com",
  projectId: "fleet-mongo",
  storageBucket: "fleet-mongo.appspot.com",
  messagingSenderId: "357538719309",
  appId: "1:357538719309:web:f8a15740d654b94430de04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage();

const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

export { signInWithPopup, auth, googleProvider, ref, storage };
