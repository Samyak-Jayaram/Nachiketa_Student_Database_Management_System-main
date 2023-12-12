import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs,getDoc,doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import { html, render } from 'https://cdn.skypack.dev/lit@2.0.0';


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


async function viewStudentProfile(name) {
    let id, qname,task;

    try {

        const studentQuerySnapshot = await getDocs(collection(db, 'userform'));


        const matchingStudent = studentQuerySnapshot.docs.find(doc => {
            const data = doc.data();
            id = Number(data.id);
            qname = String(data.name);
            task = data.task;
            console.log(`ID: ${id}, Type: ${typeof id}, Name: ${qname}`);
            return qname === name;
        });

        if (matchingStudent) 
        
        {


            window.location.href = `details.html?id=${id}`;
        } 
        else 
        {
            console.error('Student not found.');
            alert('Student not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching student details:', error.message);
        console.log(qname);
        alert('An error occurred while fetching student details. Please try again.');
    }
}



async function fetchStudentData() {
    const querySnapshot = await getDocs(collection(db, 'userform'));

    const studentData = querySnapshot.docs.map(doc => ({
        id: Number(doc.data().id),
        name: doc.data().name,
    }));


    const sortedStudentData = studentData.sort((a, b) => a.id - b.id);

    return sortedStudentData;
}


async function renderStudentList() {
    const studentListContainer = document.getElementById("studentList");


    studentListContainer.innerHTML = "";

    try {

        const studentData = await fetchStudentData();

        const template = html`
        ${studentData.map(student => html`
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td><button @click=${() => viewStudentProfile(String(student.name))}>View Profile</button></td>
            </tr>
        `)}
    `;

    render(template, studentListContainer);
    } 
    
    catch (error) 
    {
        console.error('Error fetching student data:', error.message);
        alert('An error occurred while fetching student data. Please try again.');
    }
}

renderStudentList();

document.addEventListener('DOMContentLoaded', function() {
    function redirectToNewStudentPage() {
        window.location.href = 'newstudent.html';
    }

    const addButton = document.querySelector('#addStudentButton');
    addButton.addEventListener('click', redirectToNewStudentPage);
});



document.getElementById('logoutButton').addEventListener('click', function () {

    window.location.href = 'login.html';
});



    


