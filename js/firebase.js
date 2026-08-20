import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDYXve_mVqaHZo_UfqPYA3BT-lF1OP9ATE",
    authDomain: "smart-parking-system-eaa32.firebaseapp.com",
    projectId: "smart-parking-system-eaa32",
    storageBucket: "smart-parking-system-eaa32.firebasestorage.app",
    messagingSenderId: "257977344345",
    appId: "1:257977344345:web:f02450f33146c4479f2c48",
    measurementId: "G-YEEH577C3D"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
const db = getFirestore(app);


// Export database
export { db };