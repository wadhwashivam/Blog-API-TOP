getPosts().then(function (posts) {
    const postList = document.getElementById("post-list");

    posts.forEach(function(post) {
        const listItem = document.createElement("li");
        const link = document.createElement("a");

        link.href = `post.html?id=${post.id}`;
        link.textContent = post.title;

        listItem.appendChild(link);
        postList.appendChild(listItem);
    });
}).catch(function(error) {
    console.log(error);
})