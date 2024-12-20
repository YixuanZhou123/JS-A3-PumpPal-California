import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from './firebase-config'; // Import Firebase app configuration
import { initializeApp } from 'firebase/app';

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
// const analytics = getAnalytics(app);
const db = getFirestore(app);

/**
 * Upload fueling experience data to Firebase.
 * @param {Object} data - The fueling experience data to upload.
 */
export async function uploadFuelingExperience(data) {
  try {
    await addDoc(collection(db, 'fuelingExperiences'), data);
    console.log('Data successfully uploaded:', data);
    showToast('Upload successful!');
  } catch (error) {
    console.error('Error uploading data:', error);
    showToast('Upload failed. Please try again.');
  }
}

/**
 * Display a toast message.
 * @param {string} message - The message to display.
 */
 function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = 'toast';
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
