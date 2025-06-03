
const usr = document.getElementById('user-icon');
let isLoggedIn = false; // Track login state

// Handle user icon click
if(usr){
    usr.addEventListener('click', () => {
        if (isLoggedIn) {
            // Redirect to a profile or dashboard page if logged in
            window.location.href = './profile.html';
        } else {
            // Redirect to the login page if not logged in
            window.location.href = './templates/login.html';
        }
    });

}

