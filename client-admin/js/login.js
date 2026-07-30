document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;

    login(usernameValue, passwordValue);
})