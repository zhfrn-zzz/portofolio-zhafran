import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; // Perbarui ini


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP_29pK3X7f6zL3H6i4HxpZDElS6ULO3s",
  authDomain: "portfolio-4df6b.firebaseapp.com",
  projectId: "portfolio-4df6b",
  storageBucket: "portfolio-4df6b.firebasestorage.app",
  messagingSenderId: "755004288467",
  appId: "1:755004288467:web:e9887ed4951fbca071d326"
 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };