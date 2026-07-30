document.querySelector(".signUp-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const usernameValue = document.getElementById("username").value;
    const passwordValue = document.getElementById("password").value;
    const confirmPasswordValue = document.getElementById("confirmPassword").value;
    signUp(usernameValue, passwordValue, confirmPasswordValue);

});