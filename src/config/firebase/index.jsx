// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjilerMui3r4NB9EXU9YjSl3ks3lLk4E4",
  authDomain: "ktnft-bc.firebaseapp.com",
  projectId: "ktnft-bc",
  storageBucket: "ktnft-bc.appspot.com",
  messagingSenderId: "711829381607",
  appId: "1:711829381607:web:76767aab7303c018a15d42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
export default storage;