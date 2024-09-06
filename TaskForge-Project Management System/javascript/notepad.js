document.addEventListener('DOMContentLoaded', function() {
    const addNotepadButton = document.getElementById('addNotepadButton');
    const notepadsContainer = document.getElementById('notepads');
    const notepadDate = document.getElementById('notepadDate');
    const usernameSpan = document.getElementById('username');

    // Fetch user information from localStorage or session storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        usernameSpan.textContent = userData.username;
    } else {
        // Redirect to login if user data is not found
        window.location.href = '../html/developerlogin.html';
        return;
    }

    // Load saved notepads from localStorage
    loadNotepads();

    addNotepadButton.addEventListener('click', function() {
        const date = notepadDate.value;
        if (!date) {
            alert('Please select a date');
            return;
        }

        const notepad = createNotepad(date, '', userData.username); // Pass username to createNotepad
        notepadsContainer.appendChild(notepad);
        saveNotepads();
    });

    function createNotepad(date, content, username) {
        const notepad = document.createElement('div');
        notepad.classList.add('notepad');

        const heading = document.createElement('h2');
        heading.classList.add('notepad-heading');
        heading.textContent = date;

        const contentArea = document.createElement('textarea');
        contentArea.classList.add('notepad-content');
        contentArea.placeholder = 'Add your tasks here...';
        contentArea.value = content;
        contentArea.addEventListener('input', saveNotepads);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            notepadsContainer.removeChild(notepad);
            saveNotepads();
        });

        notepad.appendChild(heading);
        notepad.appendChild(contentArea);
        notepad.appendChild(deleteButton);

        return notepad;
    }

    function saveNotepads() {
        const notepads = [];
        notepadsContainer.querySelectorAll('.notepad').forEach(notepad => {
            const date = notepad.querySelector('.notepad-heading').textContent;
            const content = notepad.querySelector('.notepad-content').value;
            notepads.push({ date, content });
        });
        localStorage.setItem('notepads', JSON.stringify(notepads));
    }

    function loadNotepads() {
        const savedNotepads = JSON.parse(localStorage.getItem('notepads')) || [];
        savedNotepads.forEach(notepadData => {
            const notepad = createNotepad(notepadData.date, notepadData.content);
            notepadsContainer.appendChild(notepad);
        });
    }
});
