import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsSFcBf4uUYRqHnOSBmMye6Cjod1Jtpe8",
    authDomain: "nachiketa-datab.firebaseapp.com",
    databaseURL: "https://nachiketa-datab-default-rtdb.firebaseio.com",
    projectId: "nachiketa-datab",
    storageBucket: "nachiketa-datab.appspot.com",
    messagingSenderId: "626383928622",
    appId: "1:626383928622:web:a041e6afa8960c0ca6cebf",
};



const app = initializeApp(firebaseConfig);
const auth = getAuth();




const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = loginForm['name'].value; 
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    signInWithEmailAndPassword(auth,email, password)
        .then((userCredential) => {
            window.location.href = 'home.html';
            alert("Welcome "+name+"!");
        })
        .catch((error) => {
            alert(error.message);
        });
});