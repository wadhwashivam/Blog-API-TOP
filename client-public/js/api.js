function getPosts(){
    return fetch(`${API_BASE_URL}/api/posts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(function(response) {
        if (!response.ok){
            throw new Error ("Issue Fetching Posts");
        }
        return response.json();
    })
}

function getPostsById(id){
    return fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(function(response) {
        if(!response.ok) {
            throw new Error("Issue fetching post.");
        }
        return response.json();
    })
}

function getCommentsByPostId(id){
    return fetch(`${API_BASE_URL}/api/posts/${id}/comments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
    .then(function(response) {
        if(!response.ok){
            throw new Error("Issue fetching comments.");
        }
        return response.json();
    })
}

function postComments(postId, content){
    if (!getToken()) {
        alert("You must be logged in to comment.");
        return;
    }
    return fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content }),

    }).then(function(response){
        if (!response.ok){
            throw new Error("Issue posting Comments.");
        }
        return response.json();
    });
}