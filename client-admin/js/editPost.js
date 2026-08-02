const params = new URLSearchParams(window.location.search);
const postId = params.get("id");


getAdminPostById(postId).then(function(post){
    document.getElementById("title").value = post.title;
    document.getElementById("content").value = post.content;
    document.getElementById("published").checked = post.published;
}).catch(function(error){
    console.log(error);
})

document.getElementById("editPost-form").addEventListener("submit", function(event){
    event.preventDefault();

    const titleValue = document.getElementById("title").value;
    const contentValue = document.getElementById("content").value;
    const publishedValue = document.getElementById("published").checked;

    updatePost(postId, titleValue, contentValue, publishedValue)
    .then(function(){
        window.location.href = "index.html";
    })
    .catch(function(error){
        console.log(error);
    })
})

document.getElementById("deletePost").addEventListener("click", function(event){
    deletePost(postId)
    .then(function(){
        window.location.href = "index.html";
    })
    .catch(function(error){
        console.log(error);
    })
})

function loadComments(){
    getCommentsByPostId(postId).then(function(comments){
        const commentsList = document.getElementById("comment-list");
        commentsList.innerHTML = "";

        comments.forEach(function(comment){
            const commentItem = document.createElement("li");
            commentItem.className = "list-row items-center";

            const commentContent = document.createElement("span");
            commentContent.textContent = comment.content;
            commentContent.className = "text-xl list-col-grow"

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-error btn-sm";

            deleteButton.textContent = "Delete Comment"
            deleteButton.addEventListener("click", function(){
                deleteCommentById(comment.id).then(function(){
                    loadComments();
                }).catch(function(error){
                    console.log(error);
                });
            });
            commentContent.textContent = comment.content;
            
            commentItem.appendChild(commentContent);
            commentItem.appendChild(deleteButton);
            commentsList.appendChild(commentItem);
        });
    }).catch(function(error){
        console.log(error);
    })
}
loadComments();