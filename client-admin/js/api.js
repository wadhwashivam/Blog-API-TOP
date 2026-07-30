function getAllPosts(){
    return fetch(`${API_BASE_URL}/api/admin/posts`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
    })
    .then(function (response){
        if(!response.ok){
            throw new Error ("Issue fetching all posts.");
        }
        return response.json();
    })
}

function createPost(title, content, published) {
    return fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body: JSON.stringify({ title, content, published }),
    })
    .then(function(response){
        if(!response.ok){
            throw new Error("Cannot Create Post");
        }
        return response.json();
    })
}

function getAdminPostById(id){
    return fetch(`${API_BASE_URL}/api/admin/posts/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}`},
    })
    .then(function(response){
        if(!response.ok){
            throw new Error("Cannot fetch admin posts.");
        }
        return response.json();
    })
}

function updatePost(id, title, content, published){
    return fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body: JSON.stringify({ title, content, published }),
    })
    .then(function(response){
        if (!response.ok){
            throw new Error("Cannot Update Post");
        }
        return response.json();
    })
}

function deletePost(id){
    return fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` }
    })
    .then(function(response){
        if(!response.ok){
            throw new Error("Cannot Delete Post");
        }
    })
}

function getCommentsByPostId(id){
    return fetch(`${API_BASE_URL}/api/posts/${id}/comments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(function(response){
        if(!response.ok){
            throw new Error("Issue fetching comments.");
        }
        return response.json();
    })
}

function deleteCommentById(id){
    return fetch(`${API_BASE_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
    })
    .then(function(response){
        if(!response.ok){
            throw new Error("Cannot Delete Comment.");
        }
    })
}