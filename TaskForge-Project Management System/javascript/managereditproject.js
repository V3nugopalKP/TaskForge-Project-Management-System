// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Check if user is authenticated
const userData = JSON.parse(localStorage.getItem('userData'));

// Redirect to login page if no user data is found or role is incorrect
if (!userData || userData.role !== 'manager') {
    window.location.href = '../html/managerlogin.html';
}

// Display username
document.getElementById('username').innerText = userData.username;

// Function to fetch and display projects
async function displayProjects() {
    try {
        const projectsRef = collection(db, 'project_details');
        const snapshot = await getDocs(projectsRef);

        const projectList = document.getElementById('projectList');
        snapshot.forEach(doc => {
            const project = doc.data();
            // Only display projects created by the logged-in manager
            if (project.manager === userData.username) {
                const projectHTML = `
                    <div class="project-card">
                        <h3>${project.title}</h3>
                        <p><strong>Description:</strong> ${project.description}</p>
                        <p><strong>Start Date:</strong> ${project.startDate}</p>
                        <p><strong>End Date:</strong> ${project.endDate}</p>
                        <p><strong>Languages Used:</strong> ${project.languages}</p>
                        <button class="edit-button" data-project-id="${doc.id}">Edit</button>
                    </div>
                    <hr>
                `;
                projectList.innerHTML += projectHTML;
            }
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Call function to display projects
displayProjects();

// Event delegation for edit buttons
document.getElementById('projectList').addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-button')) {
        const projectId = event.target.dataset.projectId;
        const projectRef = doc(db, 'project_details', projectId);
        projectRef.get().then((doc) => {
            if (doc.exists()) {
                const projectData = doc.data();
                if (projectData.manager === userData.username) {
                    populateEditForm(projectData);
                    document.getElementById('editProjectModal').style.display = 'block';
                } else {
                    console.error('Unauthorized access: You can only edit your own projects.');
                }
            } else {
                console.error('Project not found');
            }
        }).catch((error) => {
            console.error('Error fetching project:', error);
        });
    }
});

// Function to populate edit form with project details
function populateEditForm(project) {
    document.getElementById('projectId').value = project.id;
    document.getElementById('editTitle').value = project.title;
    document.getElementById('editDescription').value = project.description;
    document.getElementById('editStartDate').value = project.startDate;
    document.getElementById('editEndDate').value = project.endDate;
    document.getElementById('editLanguages').value = project.languages;

    // Example for populating tasks list (modify as per your structure)
    const tasksList = document.getElementById('editTasks');
    tasksList.innerHTML = '';
    project.tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `Task: ${task.task}, Start Date: ${task.taskStartDate}, End Date: ${task.taskEndDate}, Developers: ${task.developers.join(', ')}`;
        tasksList.appendChild(li);
    });
}

// Event listener to close edit modal
document.getElementById('closeEditModal').addEventListener('click', function() {
    document.getElementById('editProjectModal').style.display = 'none';
});

// Event listener for updating project details
document.getElementById('editProjectForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const projectId = document.getElementById('projectId').value;
    const updatedTitle = document.getElementById('editTitle').value;
    const updatedDescription = document.getElementById('editDescription').value;
    const updatedStartDate = document.getElementById('editStartDate').value;
    const updatedEndDate = document.getElementById('editEndDate').value;
    const updatedLanguages = document.getElementById('editLanguages').value;

    try {
        // Update project details in Firestore
        const projectRef = doc(db, 'project_details', projectId);
        await updateDoc(projectRef, {
            title: updatedTitle,
            description: updatedDescription,
            startDate: updatedStartDate,
            endDate: updatedEndDate,
            languages: updatedLanguages
            // Add more fields as needed
        });
        alert('Project updated successfully!');
        document.getElementById('editProjectModal').style.display = 'none';
        // Clear project list and reload projects
        document.getElementById('projectList').innerHTML = '';
        displayProjects();
    } catch (error) {
        console.error('Error updating project:', error);
        alert('Failed to update project. Please try again.');
    }
});

// Event listener for sign out button
document.getElementById('signOutButton').addEventListener('click', function() {
    localStorage.removeItem('userData'); // Clear user data
    window.location.href = '../html/managerlogin.html'; // Redirect to login page
});
