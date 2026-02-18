import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAheQuAHZfVGU-77LmYe2_oGwBRiA7zq2I",
  authDomain: "maozinhas-f3b0d.firebaseapp.com",
  projectId: "maozinhas-f3b0d",
  storageBucket: "maozinhas-f3b0d.firebasestorage.app",
  messagingSenderId: "981416836491",
  appId: "1:981416836491:web:6ea6d0086cc17bad8a438e"
};

// Initialize Firebase (works both client and server side)
function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

const app = getFirebaseApp();
const auth = typeof window !== "undefined" ? getAuth(app) : null;
const db = getFirestore(app);
const storage = typeof window !== "undefined" ? getStorage(app) : null;

export { app, auth, db, storage, firebaseConfig };

