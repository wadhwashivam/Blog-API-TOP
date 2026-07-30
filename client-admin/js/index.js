if (!getToken()){
    window.location.href = "login.html";
}else{
    getAllPosts().then(function(posts){
        const postList = document.getElementById("post-list");

        posts.forEach(post => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");

            link.href = `editPost.html?id=${post.id}`;
            link.textContent = post.title;

            if (!post.published){            
                link.style.color = "grey";
            }

            listItem.appendChild(link);
            postList.appendChild(listItem);
        });
    }).catch(function(error){
        console.log(error);
    })
}