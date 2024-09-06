// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);

document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  let role = document.getElementById('role').value;
  let username = document.getElementById('username').value;

  // Check if the username already exists
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  getDocs(q).then((querySnapshot) => {
    if (!querySnapshot.empty) {
      alert("Username already exists");
    } else {
      // Username is unique, proceed with registration
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return setDoc(doc(db, "users", user.uid), {
            name: name,
            username: username,
            email: email,
            role: role,
            createdAt: serverTimestamp()
          });
        })
        .then(() => {
          alert("User registered successfully!");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(`Error: ${errorMessage} (${errorCode})`);
        });
    }
  }).catch((error) => {
    alert(`Error checking username: ${error.message}`);
  });
});
