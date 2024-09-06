// firebaseInit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;

// Function to check authentication state
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (currentUser) {
        console.log('User is logged in:', currentUser.uid);
        // Perform actions based on user authentication state
        // For example, redirect to appropriate page based on user role
    } else {
        console.log('No user logged in');
        // Redirect to login page or handle unauthorized access
    }
});

export { app, auth, currentUser };
