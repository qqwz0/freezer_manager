import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailField = document.querySelector('input[type="email"]');
        const passwordField = document.querySelector('input[type="password"]');
        const email = emailField.value.trim();
        const password = passwordField.value;

        // Use the modular function
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User logged in:", userCredential.user);
                alert("Вхід успішний!");
                window.location.href = "freezer.html";
            })
            .catch((error) => {
                console.error("Login error:", error);
                alert("Помилка: " + error.message);
            });
    });
});
