document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('right-panel-active');
    });

    // Basic validation
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');

    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;

        document.getElementById('nameError').style.display = name ? 'none' : 'block';
        document.getElementById('emailError').style.display = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'none' : 'block';
        document.getElementById('passwordError').style.display = password.length >= 6 ? 'none' : 'block';

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) return;
    });

    signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signinEmail').value.trim();
        const password = document.getElementById('signinPassword').value;

        document.getElementById('signinEmailError').style.display = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'none' : 'block';
        document.getElementById('signinPasswordError').style.display = password ? 'none' : 'block';

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) return;

        // Redirect to the main page or perform further actions
        redirectToHomePage()
    });
});

function redirectToHomePage() {
    window.location.href = 'components/homepage/homepage.html'; // Adjust the path as necessary
}