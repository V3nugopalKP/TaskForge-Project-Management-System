import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Check if user is authenticated
const userData = JSON.parse(localStorage.getItem('userData'));

// Redirect to login page if no user data is found
if (!userData) {
    window.location.href = '../html/developerlogin.html';
}

// Display username
document.getElementById('username').innerText = userData.username;

// Function to fetch and display tasks
async function displayTasks() {
    try {
        const projectsRef = collection(db, 'project_details');
        const q = query(projectsRef);
        const snapshot = await getDocs(q);

        const taskList = document.getElementById('taskList');
        snapshot.forEach(doc => {
            const project = doc.data();
            project.tasks.forEach(task => {
                if (task.developers.includes(userData.username)) {
                    const taskHTML = `
                        <div class="task-card">
                            <h3>${task.task}</h3>
                            <p><strong>Start Date:</strong> ${task.taskStartDate}</p>
                            <p><strong>End Date:</strong> ${task.taskEndDate}</p>
                            <p><strong>Developers:</strong> ${task.developers.join(', ')}</p>
                            <p><strong>Manager:</strong> ${project.manager}</p>
                        </div>
                    `;
                    taskList.innerHTML += taskHTML;
                }
            });
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Call function to display tasks
displayTasks();

// Event listener for sign out button
document.getElementById('signOutButton').addEventListener('click', function() {
    localStorage.removeItem('userData'); // Clear user data
    window.location.href = '../html/developerlogin.html'; // Redirect to login page
});
