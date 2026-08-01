if (!getToken()){
    window.location.href = "login.html";
}else{
    getAllPosts().then(function(posts){
        const postList = document.getElementById("post-list");

        posts.forEach(post => {
            const listItem = document.createElement("li");
            listItem.className = "list-row";

            const link = document.createElement("a");
            link.href = `editPost.html?id=${post.id}`;
            link.textContent = post.title;
            link.className = "link link-hover font-medium"

            if (!post.published){
                link.classList.add("opacity-50");
                
                const badge = document.createElement("span");
                badge.className = "badge badge-ghost badge-sm ml-2";
                badge.textContent = "Draft";

                link.appendChild(badge);
            }

            listItem.appendChild(link);
            postList.appendChild(listItem);
        });
    }).catch(function(error){
        console.log(error);
    })
}