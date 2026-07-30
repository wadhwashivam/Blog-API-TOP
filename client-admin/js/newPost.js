document.getElementById("newPost-form").addEventListener("submit", function(event){
    event.preventDefault();

    const titleValue = document.getElementById("title").value;
    const contentValue = document.getElementById("content").value;
    const publishedValue = document.getElementById("published").checked;

    createPost(titleValue, contentValue, publishedValue)
    .then(function(){
        window.location.href = "index.html";
    })
    .catch(function(error){
        console.log(error);
    })
})