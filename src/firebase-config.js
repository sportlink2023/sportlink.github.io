// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import { getStorage } from "firebase/storage";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDun-e79vOPdzd__eFTldwtp1XJMrFsHQI",
  authDomain: "ismailhiko-sportlink.firebaseapp.com",
  databaseURL: "https://ismailhiko-sportlink-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ismailhiko-sportlink",
  storageBucket: "ismailhiko-sportlink.appspot.com",
  messagingSenderId: "1066273235757",
  appId: "1:1066273235757:web:90591993c8b203989e29a4",
  measurementId: "G-Z1LSWMMEVD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//utile pour authentification
export const auth = getAuth(app)

//utile pour la base de donnée
export const db = getFirestore(app)

export const storage = getStorage(app);
