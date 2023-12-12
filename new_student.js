import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection,doc, addDoc,getDoc,setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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
const db = getFirestore(app); 

const form = document.querySelector("#userform");
const nameInput = document.querySelector("#name");
const ageInput = document.querySelector("#age");
const mentalConditionInput = document.querySelector("#mentalCondition");
const additionalInfoInput = document.querySelector("#additionalInfo");
const submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!nameInput.value || !ageInput.value || !mentalConditionInput.value) {
        alert('Please fill in all fields');
        return;
    }

    try {

        const idSnapshot = await getDoc(doc(db, 'meta', 'studentCount'));
        let currentId = idSnapshot.data()?.id || 0;


        currentId++;


        await setDoc(doc(db, 'meta', 'studentCount'), { id: currentId });


        const docRef = await addDoc(collection(db, 'userform'), {
            
            id: currentId,
            name: nameInput.value,
            age: ageInput.value,
            mentalCondition: mentalConditionInput.value,
            additionalInfo: additionalInfoInput.value, 
        });
        
        window.location.href = 'home.html';
    } 
    
    catch (error) 
    {
        console.error('Error sending data to Firestore:', error.message);
        alert("An error occurred.",error.message);
    }
});
