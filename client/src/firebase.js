// src/firebase.js

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYYG8bhQuZwouVewL9AtpNRaqVEidYil8",
  authDomain: "janani-aarogya.firebaseapp.com",
  projectId: "janani-aarogya",
  storageBucket: "janani-aarogya.appspot.com", 
  messagingSenderId: "679885714514",
  appId: "1:679885714514:web:bc0ed5a4123ac34d17db8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
