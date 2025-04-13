import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDDjg-YMs-i_TAem3LJk4j-qrgXYPUIsO8",
    authDomain: "freezer-manager-36acd.firebaseapp.com",
    projectId: "freezer-manager-36acd",
    storageBucket: "freezer-manager-36acd.firebasestorage.app",
    messagingSenderId: "572471426932",
    appId: "1:572471426932:web:3a4fca9342a8c9ae883621",
    measurementId: "G-N8SX67S0SY"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  
  export { auth, firestore };