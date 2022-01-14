import { initializeApp } from "firebase/app";
import {getAuth } from "firebase/auth" ;
import {getFirestore} from "firebase/firestore"

// FireBase konfigurācija
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Inicializē Firebase 
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore()

export { auth, db}