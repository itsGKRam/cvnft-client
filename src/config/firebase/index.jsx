// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ9g4iW4D2aTAz0UD9I77-gTAn9rmpfhA",
  authDomain: "cookingvideonft.firebaseapp.com",
  projectId: "cookingvideonft",
  storageBucket: "cookingvideonft.appspot.com",
  messagingSenderId: "959739983278",
  appId: "1:959739983278:web:ecc03a5687bef670e0c43f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const database = getDatabase(app);
const firestore = getFirestore(app);


export { database, firestore, storage };

export default storage;