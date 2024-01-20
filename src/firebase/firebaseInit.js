// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBx-0RqvgMWtHDR_OidI2H1XkjIrj0CsqY",
  authDomain: "yaz-lab-2-46ab8.firebaseapp.com",
  projectId: "yaz-lab-2-46ab8",
  storageBucket: "yaz-lab-2-46ab8.appspot.com",
  messagingSenderId: "1048824336956",
  appId: "1:1048824336956:web:bed1e8238f53f732002939"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const  auth = getAuth();

export const db = getFirestore(app);

export const storage = getStorage(app);