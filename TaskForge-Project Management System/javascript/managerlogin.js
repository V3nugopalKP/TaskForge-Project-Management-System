// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      // Check if the user has the role of "manager"
      if (userData.role === "manager") {
        // Update Firestore with last login timestamp
        await setDoc(doc(db, "users", user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });

        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        // Redirect to personalized page
        window.location.href = 'managermain.html';
      } else {
        // Display error message if the user is not a manager
        document.getElementById('errorMessage').innerText = 'Access denied: Only managers can log in.';
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById('errorMessage').innerText = 'User not found or invalid credentials.';
    });
});
