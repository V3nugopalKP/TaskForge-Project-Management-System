document.addEventListener('DOMContentLoaded', function(){
    const target = document.getElementById('typing-animation');
    const text = 'TaskForge.';
    let index = 0;

    function type() {
        if (index < text.length) {
            target.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150); // Typing speed (adjust as needed)
        } else {
            setTimeout(erase, 1000); // Wait before erasing
        }
    }

    function erase() {
        if (index >= 0) {
            target.textContent = text.substring(0, index);
            index--;
            setTimeout(erase, 50); // Deleting speed (adjust as needed)
        } else {
            setTimeout(type, 500); // Wait before typing again
        }
    }

    type(); // Start the typing animation
});

function changeScreen() {
    document.body.style.animation = "fadeOut 1s forwards"; // Apply fade out animation to body
    setTimeout(function() {
        window.location.href = "../html/login.html"; // Redirect to login.html after animation
    }, 1000); // Wait for 1 second (same as fade out duration)
}
