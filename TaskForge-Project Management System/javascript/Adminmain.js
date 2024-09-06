import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is authenticated
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  // Redirect to login page if no user data is found


  if (userData.role !== 'admin') {
    alert('Access Denied: Insufficient permissions');
    window.location.href = '../html/Trilogin.html'; // Redirect to a more appropriate page
    return;
  }

  // Set the username in the welcome message and profile button if applicable
  const username = userData.username;
  if (document.getElementById('username')) {
    document.getElementById('username').innerText = username;
  }
  if (document.getElementById('usernameText')) {
    document.getElementById('usernameText').innerText = username;
  }

  // Handle menu functionality and clock update
  document.getElementById('toggleButton').addEventListener('click', function() {
    var menu = document.getElementById('slideInMenu');
    var button = document.getElementById('toggleButton');

    // Toggle the 'open' class to show/hide the menu
    menu.classList.toggle('open');

    // Toggle button text based on menu state
    if (menu.classList.contains('open')) {
      button.textContent = "← Menu";
    } else {
      button.textContent = "Menu →";
    }
  });

  document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = '../html/adminreg.html'; // Redirect to admin registration page
  });

  document.getElementById('mailButton').addEventListener('click', function() {
    window.location.href = 'https://mail.google.com/mail/u/0/#inbox'; // Redirect to Gmail
  });

  document.getElementById('userbutton').addEventListener('click', function() {
    window.location.href = '../html/adminuserdetails.html'; // Redirect to user details page
  });

  document.getElementById('chatButton').addEventListener('click', function() {
    window.location.href = '../html/chatapplicationadmin.html'; // Redirect to chat application page
  });

  document.getElementById('reportButton').addEventListener('click', function() {
    window.location.href = '../html/adminreports.html'; // Redirect to reports and analytics page
  });

  document.getElementById('signOutButton').addEventListener('click', function() {
    // Clear user data from localStorage
    localStorage.removeItem('userData');
    
    // Redirect to login page
    window.location.href = '../html/adminlogin.html'; // Adjust based on role if needed
  });

  function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    // Add leading zeros if necessary
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var timeString = hours + ":" + minutes + ":" + seconds;
    document.getElementById('clock').textContent = timeString; // Update the content of the clock element
  }

  // Call updateClock every second
  setInterval(updateClock, 1000);

  // Your Firebase configuration
  const firebaseConfig = {
//Add the api of firebase here
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function fetchCounts() {
    try {
      const developerQuery = query(collection(db, "users"), where("role", "==", "developer"));
      const managerQuery = query(collection(db, "users"), where("role", "==", "manager"));

      const developerSnapshot = await getDocs(developerQuery);
      const managerSnapshot = await getDocs(managerQuery);

      const developerCount = developerSnapshot.size;
      const managerCount = managerSnapshot.size;

      console.log("Developer Count:", developerCount);
      console.log("Manager Count:", managerCount);

      return { developerCount, managerCount };
    } catch (error) {
      alert("Error fetching data: " + error);
      return null; // Return null if there's an error fetching data
    }
  }

  async function fetchProjectCounts() {
    try {
      const projectQuery = query(collection(db, "project_details"));
      const projectSnapshot = await getDocs(projectQuery);
      const projectCount = projectSnapshot.size;

      console.log("Project Count:", projectCount);

      return projectCount;
    } catch (error) {
      alert("Error fetching project data: " + error);
      return null; // Return null if there's an error fetching data
    }
  }

  async function updateDashboard() {
    const counts = await fetchCounts();
    const projectCount = await fetchProjectCounts();

    if (counts) {
      document.getElementById('totalDevelopers').textContent = counts.developerCount;
      document.getElementById('totalManagers').textContent = counts.managerCount;
      document.getElementById('totalProjects').textContent = projectCount;
    } else {
      alert("Data fetch failed. Unable to update dashboard.");
    }
  }

  updateDashboard();
});
