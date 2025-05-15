// Firebase configuration for Weekly Showcase application
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  Firestore,
} from "firebase/firestore";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if we're in the browser and have a valid API key
let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;
let db: Firestore | undefined = undefined;

// This prevents initialization on the server and avoids hydration errors
const isBrowser = typeof window !== "undefined";

// Skip Firebase initialization during server-side rendering
if (isBrowser) {
  try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app);
    } else {
      console.error(
        "Firebase API key is missing or undefined. Check your .env.local file."
      );
      console.log("Current environment config:", {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "exists" : "missing",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
          ? "exists"
          : "missing",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          ? "exists"
          : "missing",
      });
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export {
  app,
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
export {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  deleteDoc,
};
