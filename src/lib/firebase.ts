import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0YYU96YfGm4SBFlLV_zUAH3U7ngTCYuk",
  authDomain: "sincere-episode-lkpr3.firebaseapp.com",
  projectId: "sincere-episode-lkpr3",
  storageBucket: "sincere-episode-lkpr3.firebasestorage.app",
  messagingSenderId: "1098163928589",
  appId: "1:1098163928589:web:3260d0c4032f4ad6e6df44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
