import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, deleteUser as deleteAuthUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to fetch and display user data
async function displayUsers() {
  const developerListElement = document.getElementById('developers');
  const managerListElement = document.getElementById('managers');

  // Clear existing user lists
  developerListElement.innerHTML = '';
  managerListElement.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const userCard = document.createElement('div');
      userCard.className = 'user-card';

      const userInfo = document.createElement('div');
      userInfo.className = 'user-info';
      userInfo.innerHTML = `
        <span>Username: ${userData.username}</span>
        <span>Email: ${userData.email}</span>
      `;

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => confirmDelete(doc.id, userData.email));

      userCard.appendChild(userInfo);
      userCard.appendChild(deleteButton);

      // Add the user card to the appropriate section based on role
      if (userData.role === 'developer') {
        developerListElement.appendChild(userCard);
      } else if (userData.role === 'manager') {
        managerListElement.appendChild(userCard);
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Function to confirm delete action
function confirmDelete(uid, email) {
  const confirmation = confirm("Are you sure you want to delete this user?");
  if (confirmation) {
    deleteUserAndData(uid, email);
  }
}

// Function to delete user data and user authentication
async function deleteUserAndData(uid, email) {
  try {
    // Delete user data from Firestore
    await deleteDoc(doc(db, "users", uid));

    // Find the user by email and delete user authentication
    const user = (await auth.getUserByEmail(email)).uid;
    await deleteAuthUser(user);

    alert('User deleted successfully');
    // Refresh the user list to update the displayed users
    displayUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

// Call the function to display users when the page loads
document.addEventListener('DOMContentLoaded', displayUsers);
