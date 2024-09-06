// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const form = document.getElementById('projectForm');
const developerSelect = document.getElementById('developer');
const managerSelect = document.getElementById('manager');
const tasksList = document.getElementById('tasks');
const addTaskButton = document.getElementById('addTaskButton');

let tasks = [];

// Populate developer and manager dropdowns from database
async function populateUsers() {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const user = doc.data();
        const option = document.createElement('option');
        option.value = user.username;
        option.textContent = user.name;

        if (user.role === "developer") {
            developerSelect.appendChild(option.cloneNode(true));
        } else if (user.role === "manager") {
            managerSelect.appendChild(option);
        }
    });
}

populateUsers();

addTaskButton.addEventListener('click', () => {
    const task = document.getElementById('task').value;
    const taskStartDate = document.getElementById('taskStartDate').value;
    const taskEndDate = document.getElementById('taskEndDate').value;
    const selectedDevelopers = Array.from(developerSelect.selectedOptions).map(option => option.value);
    
    if (task && taskStartDate && taskEndDate && selectedDevelopers.length > 0) {
        tasks.push({ task, taskStartDate, taskEndDate, developers: selectedDevelopers });
        const li = document.createElement('li');
        li.textContent = `${task} - ${taskStartDate} to ${taskEndDate} (Developers: ${selectedDevelopers.join(", ")})`;
        tasksList.appendChild(li);
        document.getElementById('task').value = '';
        document.getElementById('taskStartDate').value = '';
        document.getElementById('taskEndDate').value = '';
    } else {
        alert('Please enter task, start date, end date, and select at least one developer.');
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const languages = document.getElementById('languages').value;
    const manager = document.getElementById('manager').value;

    try {
        // Map tasks array to include additional fields
        const updatedTasks = tasks.map(task => ({
            ...task
        }));

        const docRef = await addDoc(collection(db, "project_details"), {
            title,
            description,
            startDate,
            endDate,
            languages,
            manager,
            tasks: updatedTasks,
            createdAt: serverTimestamp()
        });
        alert("Project created successfully!");
        form.reset();
        tasksList.innerHTML = '';
        tasks = [];
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error creating project. Please try again.");
    }
});

