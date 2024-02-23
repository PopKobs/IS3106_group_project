// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIWmjWFBlyskPQe0VpTVfBcnngYR3BEnQ",
  authDomain: "nomsfood-3261c.firebaseapp.com",
  projectId: "nomsfood-3261c",
  storageBucket: "nomsfood-3261c.appspot.com",
  messagingSenderId: "702473182845",
  appId: "1:702473182845:web:67a61a7f465d85d2e41b14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();