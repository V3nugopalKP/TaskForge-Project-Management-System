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
  if (!userData || userData.role !== 'developer') {
    window.location.href = '../html/developerlogin.html';
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

  document.getElementById('noteButton').addEventListener('click', function() {
    window.location.href = '../html/notepad.html';
  });

  document.getElementById('taskButton').addEventListener('click', function() {
    window.location.href = '../html/devtaskdetails.html';
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

  document.getElementById('mailButton').addEventListener('click', function() {
    window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
  });

  document.getElementById('chatButton').addEventListener('click', function() {
    window.location.href = '../html/chatapplicationdev.html';
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

  // Function to fetch and display the total count of tasks assigned to the current developer
  

  // Function to fetch and display task details
  
  // Event listener for task count
  document.getElementById('taskCount').addEventListener('click', function() {
    fetchTaskDetails();
  });

  // Close task details modal
  document.getElementById('closeTaskModal').addEventListener('click', function() {
    document.getElementById('taskDetailsModal').style.display = 'none';
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

