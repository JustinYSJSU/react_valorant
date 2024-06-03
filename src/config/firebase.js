// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyrbOCUEq9Q5GQ7Kyc5LEivK5voWg5gLI",
  authDomain: "react-valorant.firebaseapp.com",
  projectId: "react-valorant",
  storageBucket: "react-valorant.appspot.com",
  messagingSenderId: "540385153202",
  appId: "1:540385153202:web:b7dbf1fa6ae1d46b0e39ab",
  measurementId: "G-58D4YHPHV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app)

