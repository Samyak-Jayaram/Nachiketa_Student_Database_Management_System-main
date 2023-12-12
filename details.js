import { html, render } from 'https://cdn.skypack.dev/lit@2.0.0';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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

const detailsContainer = document.getElementById("studentDetailsContainer");

const urlParams = new URLSearchParams(window.location.search);
const currentId = Number(urlParams.get('id'));

const querySnapshot = await getDocs(collection(db, 'userform'));

const studentData = querySnapshot.docs
    .filter(doc => Number(doc.data().id) === currentId)
    .map(doc => ({
        id: Number(doc.data().id),
        name: doc.data().name,
        mentalCondition: doc.data().mentalCondition,
        additionalInfo: doc.data().additionalInfo,
    }))[0];

const detailsTemplate = html`
    <div>
        <p><strong>ID:</strong> ${studentData.id}</p>
        <p><strong>Name:</strong> ${studentData.name}</p>
        <p><strong>Mental condition:</strong> ${studentData.mentalCondition}</p>
        <p><strong>About:</strong> ${studentData.additionalInfo}</p>

        <div id="app">

  <div>
    <label for="mainTask"><strong>Main Task:</strong></label>
    <input v-model="mainTask" id="mainTask" type="text">
    <button @click="addMainTaskToFirebase">Add Main Task</button> 
  </div>

  <div v-if="selectedMainTask !== null">
    <label class="subtask-h1" for="subTask"><strong>Subtask:</strong></label>
    <input v-model="subTask" id="subTask" type="text">
    <button @click="addSubTask">Add Subtask</button>
    <button @click="closeSubTask">Close</button>
  </div>

  <ul>
    <li v-for="(mainTask, mainIndex) in mainTasks" :key="mainIndex">
      {{ mainTask.text }}
      <ul>
        <li v-for="(subTask, subIndex) in mainTask.subtasks" :key="subIndex">
          {{ subTask.text }}
        </li>
      </ul>
      <button @click="selectMainTask(mainIndex)">Add Subtask</button>
    </li>
  </ul>
</div>
        <!-- Add more placeholders for other details as needed -->
    </div>
`;

render(detailsTemplate, detailsContainer);


new Vue({
    el: '#app',
    data: {
      mainTask: '',
      subTask: '',
      mainTasks: [],
      selectedMainTask: null
    },
    methods: {

        async fetchStudentData() {
            const querySnapshot = await getDocs(collection(db, 'userform'));
    
            const studentData = querySnapshot.docs
            .filter(doc => Number(doc.data().id) === currentId)
            .map(doc => ({
                id: Number(doc.data().id),
                name: doc.data().name,
                tasks: doc.data().tasks || [], 
        
            }))[0];
    
            return studentData;
          },
    
      async addMainTaskToFirebase() {
        const studentData = await this.fetchStudentData();
        const existingTasks = studentData.tasks || [];
    
 
        let taskKey = `task_${(existingTasks.length ? existingTasks.length + 1 : 1)}`;
    
  
        while (existingTasks.some(task => task[taskKey])) {
            taskKey = `task_${(parseInt(taskKey.split('_')[1]) + 1)}`;
        }
    
        if (currentId) {
            const userformCollectionRef = collection(db, 'userform');
            const q = query(userformCollectionRef, where('id', '==', currentId));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const studentDocRef = querySnapshot.docs[0].ref;
    

                existingTasks.push({
                    [taskKey]: {
                        text: this.mainTask,
                        subtasks: [],
                    },
                });
    

                await updateDoc(studentDocRef, {
                    tasks: existingTasks,
                });
    

                this.mainTasks.push({
                    text: this.mainTask,
                    subtasks: [],
                });
    

                this.mainTask = '';
    
            } else {

                await addDoc(collection(db, 'userform'), {
                    id: currentId,
                    tasks: [{
                        [taskKey]: {
                            text: this.mainTask,
                            subtasks: [],
                        },
                    }],
                });
    

                this.mainTasks.push({
                    text: this.mainTask,
                    subtasks: [],
                });
    

                this.mainTask = '';
            }
        }
    },


    async addSubTask() {
        const studentData = await this.fetchStudentData();
        const existingTasks = studentData.tasks || [];
    
        if (currentId && this.selectedMainTask !== null) {
            const userformCollectionRef = collection(db, 'userform');
            const q = query(userformCollectionRef, where('id', '==', currentId));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const studentDocRef = querySnapshot.docs[0].ref;
                const mainTaskKey = `task_${this.selectedMainTask + 1}`;
    

                const selectedMainTask = existingTasks[this.selectedMainTask][mainTaskKey];
    
 
                selectedMainTask.subtasks = selectedMainTask.subtasks || [];
                selectedMainTask.subtasks.push({
                    text: this.subTask,
                });
    

                await updateDoc(studentDocRef, {
                    tasks: existingTasks,
                });
    

                const updatedData = await this.fetchStudentData();
    

                this.mainTasks = updatedData.tasks.map(taskObj => ({
                    text: Object.values(taskObj)[0].text,
                    subtasks: Object.values(taskObj)[0].subtasks || [],
                }));
    
                this.subTask = '';
                this.selectedMainTask = null;
    
            } else {
                alert("Error: Unable to find the document.");
            }
        } else {
            alert("Error: Invalid student ID or main task not selected.");
        }
    },

    closeSubTask() {
        this.subTask = ''; 
        this.selectedMainTask = null;
    },


    selectMainTask(index) {
        this.selectedMainTask = index;
      }
    },

    

    mounted() {

        this.fetchStudentData().then(studentData => {
          this.mainTasks = studentData.tasks.map(taskObj => ({
            text: Object.values(taskObj)[0].text,
            subtasks: Object.values(taskObj)[0].subtasks || [],
        }));
    });
  }
});







