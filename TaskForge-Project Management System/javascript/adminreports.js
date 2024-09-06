import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseConfig = {
//Add the api of firebase here
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    async function fetchUsers() {
        try {
            const userCollection = collection(db, "users");
            const userSnapshot = await getDocs(userCollection);
            const userList = userSnapshot.docs.map(doc => doc.data());

            return userList;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    }

    async function updateUserTable() {
        const users = await fetchUsers();
        const tableBody = document.getElementById('userTableBody');
        
        tableBody.innerHTML = ""; // Clear existing data

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.createdAt ? formatTimestamp(user.createdAt) : 'N/A'}</td>
                <td>${user.lastLogin ? formatTimestamp(user.lastLogin) : 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function formatTimestamp(timestamp) {
        const date = timestamp.toDate();
        return date.toLocaleString('en-US', { timeZone: 'UTC' });
    }

    updateUserTable();

    document.getElementById('signOutButton').addEventListener('click', function() {
        // Clear user data from localStorage
        localStorage.removeItem('userData');
        // Redirect to login page
        window.location.href = '../html/adminlogin.html';
    });
});
