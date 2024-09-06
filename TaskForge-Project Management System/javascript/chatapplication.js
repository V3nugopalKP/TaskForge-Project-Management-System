import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
//Add the api of firebase here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUserEmail = null;
let currentChatUserEmail = null;

// Function to search users
async function searchUsers(searchTerm) {
  const usersQuery = query(collection(db, 'users'), where('email', '==', searchTerm));
  const usersSnapshot = await getDocs(usersQuery);
  const userList = document.getElementById('userList');
  userList.innerHTML = '';

  usersSnapshot.forEach(doc => {
    const userData = doc.data();
    const li = document.createElement('li');
    li.textContent = `${userData.username} (${userData.email})`;
    li.addEventListener('click', () => startChat(userData.email));
    userList.appendChild(li);
  });
}

// Function to start a chat with a selected user
function startChat(userEmail) {
  currentChatUserEmail = userEmail;
  document.getElementById('chatWith').textContent = `Chat with: ${userEmail}`;
  loadMessages();
}

// Function to load messages between current user and chat user
function loadMessages() {
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';

  const chatQuery = query(collection(db, 'messages'), where('participants', 'array-contains', currentUserEmail));
  onSnapshot(chatQuery, snapshot => {
    chatMessages.innerHTML = '';
    snapshot.forEach(doc => {
      const messageData = doc.data();
      if (messageData.participants.includes(currentChatUserEmail)) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.classList.add(messageData.sender === currentUserEmail ? 'sent' : 'received');
        div.textContent = messageData.text;
        chatMessages.appendChild(div);
      }
    });
  });
}

// Function to send a message
async function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const text = messageInput.value.trim();

  if (text && currentChatUserEmail) {
    await addDoc(collection(db, 'messages'), {
      text,
      sender: currentUserEmail,
      participants: [currentUserEmail, currentChatUserEmail],
      timestamp: serverTimestamp()
    });

    messageInput.value = '';
  }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);

// Search for users when typing in search input
document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim();
  if (searchTerm) {
    searchUsers(searchTerm);
  } else {
    document.getElementById('userList').innerHTML = '';
  }
});

// Initialize chat app after user logs in
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserEmail = user.email;
  } else {
    // Redirect to login page or handle unauthorized access
  }
});

// Example login (replace with your login logic)
signInWithEmailAndPassword(auth, 'your_email@example.com', 'your_password').catch(console.error);
