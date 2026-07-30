function signUp(username, password, confirmPassword){
    fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword }),
    })
    .then(function(response) {
        if(!response.ok) {
            throw new Error("Signup Failed");
        }
        return response.json();
    })
    .then(function(data){
        window.location.href = "login.html";
    })
    .catch(function(error) {
        console.log(error);
    })
}

function login(username, password){
    fetch(`${API_BASE_URL}/login`, {
        method:"POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, password}),
    })
    .then(function(response) {
        if (!response.ok){
            throw new Error("Login Failed");
        }
        return response.json();
    })
    .then(function(data) {
        setToken(data.token);
        window.location.href = "index.html";
    })
    .catch(function(error) {
        console.log(error);
    })

}

function setToken(token){
    localStorage.setItem("token", token);
}

function getToken(){
    return localStorage.getItem("token");
}


