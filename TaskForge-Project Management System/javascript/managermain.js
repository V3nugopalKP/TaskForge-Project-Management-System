import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration
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
    return;
  }

  // Set the username in the welcome message and user button
  const username = userData.username;
  document.getElementById('username').innerText = username;
  document.getElementById('usernameText').innerText = username;

  // Existing toggle menu code
  document.getElementById('toggleButton').addEventListener('click', function() {
    var menu = document.getElementById('slideInMenu');
    var button = document.getElementById('toggleButton');

    menu.classList.toggle('open');

    if (menu.classList.contains('open')) {
      button.textContent = "← Menu";
    } else {
      button.textContent = "Menu →";
    }
  });

  // Event listeners for buttons
  document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = '../html/managercreateproject.html';
  });
  document.getElementById('editButton').addEventListener('click', function() {
    window.location.href = '../html/managereditproject.html';
  });

  document.getElementById('mailButton').addEventListener('click', function() {
    window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
  });

  document.getElementById('chatButton').addEventListener('click', function() {
    window.location.href = '../html/chatapplication.html';
  });

  document.getElementById('gitButton').addEventListener('click', function() {
    window.location.href = 'https://github.com/';
  });

  document.getElementById('meetButton').addEventListener('click', function() {
    window.location.href = 'https://meet.google.com/';
  });

  document.getElementById('signOutButton').addEventListener('click', function() {
    // Clear user data from localStorage
    localStorage.removeItem('userData');

    // Redirect to login page
    window.location.href = '../html/managerlogin.html';
  });

  // Clock update function
  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var timeString = hours + ":" + minutes + ":" + seconds;
    document.getElementById('clock').textContent = timeString;
  }

  // Call updateClock every second
  setInterval(updateClock, 1000);

  // Function to fetch and display the total count of projects managed by the current user
  async function fetchProjectCount() {
    try {
      const projectsSnapshot = await getDocs(query(collection(db, 'project_details'), where('manager', '==', username)));
      const projectCount = projectsSnapshot.size;
      document.getElementById('projectCount').innerText = projectCount;
    } catch (error) {
      console.error('Error fetching project count:', error);
    }
  }

  // Fetch and display the project count on page load
  fetchProjectCount();

  // Function to fetch and display project details
  async function fetchProjectDetails() {
    try {
      const projectsSnapshot = await getDocs(query(collection(db, 'project_details'), where('manager', '==', username)));
      const projects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Generate HTML for project details
      const projectDetailsHtml = projects.map(project => `
        <div>
          <h3>${project.title}</h3>
          <p><strong>Description:</strong> ${project.description}</p>
          <p><strong>Start Date:</strong> ${project.startDate}</p>
          <p><strong>End Date:</strong> ${project.endDate}</p>
          <p><strong>Languages:</strong> ${project.languages}</p>
          <!-- Add more fields as needed -->
        </div>
        <hr>
      `).join('');

      // Display project details in the modal
      document.getElementById('projectDetails').innerHTML = projectDetailsHtml;
      document.getElementById('projectDetailsModal').style.display = 'block';
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  }

  // Event listener for project count
  document.getElementById('projectCount').addEventListener('click', function() {
    fetchProjectDetails();
  });

  // Close project details modal
  document.getElementById('closeProjectModal').addEventListener('click', function() {
    document.getElementById('projectDetailsModal').style.display = 'none';
  });

  // Display the user details modal when the user button is clicked
  document.getElementById('userButton').addEventListener('click', function() {
    // Fetch user details from localStorage
    const userDetails = {
      name: userData.name,
      email: userData.email,
      role: userData.role
    };

    // Set user details in the modal
    document.getElementById('modalName').innerText = userDetails.name;
    document.getElementById('modalEmail').innerText = userDetails.email;
    document.getElementById('modalRole').innerText = userDetails.role;

    // Show the modal
    document.getElementById('userModal').style.display = 'block';
  });

  // Close the user details modal when the close button is clicked
  document.getElementById('closeModalButton').addEventListener('click', function() {
    document.getElementById('userModal').style.display = 'none';
  });
});
