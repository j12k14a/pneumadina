import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  increment, 
  getDoc, 
  collection, 
  getDocs 
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "pneumadina-611a2",
  appId: "1:183010284675:web:323c5fa96344e5d0f2b7b6",
  storageBucket: "pneumadina-611a2.firebasestorage.app",
  apiKey: "AIzaSyAGRJ-hjIgAFj-kWmCJUg8QkNUPpwhPePg",
  authDomain: "pneumadina-611a2.firebaseapp.com",
  messagingSenderId: "183010284675",
  measurementId: "G-WM4FXZ7872"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn('Firebase Firestore initialization:', e);
}

export { 
  db, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  increment, 
  getDoc, 
  collection, 
  getDocs 
};
