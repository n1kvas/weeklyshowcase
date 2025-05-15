// TEMPORARY TEST FILE - DO NOT COMMIT
// Firebase configuration with direct values for testing
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqgvGTgmW9F8LPcwoHtjWcG9vuqiVnhJA",
  authDomain: "weeklyshowcase-4b646.firebaseapp.com",
  projectId: "weeklyshowcase-4b646",
  storageBucket: "weeklyshowcase-4b646.firebasestorage.app",
  messagingSenderId: "687646788171",
  appId: "1:687646788171:web:d0f8e8399be96fd2011bce",
  measurementId: "G-EHY1Z4MEGD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
