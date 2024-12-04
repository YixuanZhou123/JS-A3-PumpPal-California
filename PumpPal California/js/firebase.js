// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import firebase from "firebase/app";
import "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSj9cdE6updgleeKwJMKGQziiZir3xCUc",
  authDomain: "pumppal-california.firebaseapp.com",
  projectId: "pumppal-california",
  storageBucket: "pumppal-california.firebasestorage.app",
  messagingSenderId: "657175277465",
  appId: "1:657175277465:web:ed3e1af96b3d2c194b6d08",
  measurementId: "G-LNYFTL1204"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


firebase.initializeApp(firebaseConfig);
export default firebase;