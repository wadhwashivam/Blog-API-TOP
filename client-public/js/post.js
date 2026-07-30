const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

getPostsById(postId).then(function(post) {
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-content").textContent = post.content;

}).catch(function(error){
    console.log(error);
})

function loadComments(){
    getCommentsByPostId(postId).then(function(comments) {
        const commentsList = document.getElementById("comment-list");
        commentsList.innerHTML = "";

        comments.forEach(function(comment) {
            const commentItem = document.createElement("li");
            const commentContent = document.createElement("span");
            
            commentContent.textContent = comment.content;

            commentItem.appendChild(commentContent);
            commentsList.appendChild(commentItem);
        });
    }).catch(function(error){
        console.log(error);
    });
}

loadComments();


document.getElementById("comment-form").addEventListener("submit", function(event){
    event.preventDefault();

    const content = document.getElementById("comment-content").value;

    postComments(postId, content).then(function() {
        document.getElementById("comment-content").value = "";
        loadComments();
    }).catch(function(error) {
        console.log(error);
    });
});
