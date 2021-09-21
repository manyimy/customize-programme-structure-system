import firebase from 'firebase';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp-MrV1AwmMQ5-QJXM6I-VJaRH9kcYYUI",
  authDomain: "customize-programme-structure.firebaseapp.com",
  databaseURL: "https://customize-programme-structure-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "customize-programme-structure",
  storageBucket: "customize-programme-structure.appspot.com",
  messagingSenderId: "969128291955",
  appId: "1:969128291955:web:7a3b0791902fc0ce8d4406",
  measurementId: "G-241H9RWCND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebase;