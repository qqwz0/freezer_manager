// Import Firebase instances from your configuration file.
import { auth, firestore } from './firebase-config.js';
// Import required Firebase Auth and Firestore functions.
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(firestore, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date()
    });
    
    alert("Registration successful!");
  } catch (error) {
    console.error("Error registering user:", error);
    alert("Error: " + error.message);
  }
});