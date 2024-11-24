// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1_PqQmBv8unlsrcspWfwgVbpTPxy5Ais",
  authDomain: "rcg-game.firebaseapp.com",
  projectId: "rcg-game",
  storageBucket: "rcg-game.appspot.com",
  messagingSenderId: "512076336099",
  appId: "1:512076336099:web:4324fac4a5c1b9d3adeed6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);
const storage = getStorage(app);
// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { db, auth,storage };