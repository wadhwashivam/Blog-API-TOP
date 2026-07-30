import prisma from "./prisma.js";

// Below two functions are only for authentication purposes.
async function getUserByUsername(username){
    return prisma.user.findUnique({
        where: { username }
    });
}

async function getUserById(id){
    return prisma.user.findUnique({
        where: { id }
    });
}

async function getPublishedPosts(){
    return prisma.post.findMany({
        where: { published: true }
    });
}

async function getPostsById(id){
    return prisma.post.findUnique({
        where: { published: true, id}
    });
}

async function createPosts(title, content, published, authorId){
    return prisma.post.create({
        data: {
            title: title,
            content: content,
            published: published,
            authorId: authorId,
        },
    });
}

async function updatePost(id, updates){
    return prisma.post.update({
        where: { id },
        data: updates,
    });
}

async function deletePostById(id){
    return prisma.post.delete({
        where: {id},
    });
}

async function getCommentsByPostId(id) {
    return prisma.comment.findMany({
        where: {postId: id},
    });
}

async function getCommentById(id){
    return prisma.comment.findUnique({
        where: { id }
    });
}

async function createCommentsByPostId(content, authorId, id){
    return prisma.comment.create( {
        data: {
            content: content,
            authorId: authorId,
            postId: id,
        },
    });
}

async function deleteCommentById(id){
    return prisma.comment.delete({
        where: { id },
    });
}

async function createUser(username, hashedPassword){
    return prisma.user.create({
        data: {
            username:username,
            password: hashedPassword
        }
    })
}

async function getAllPosts(){
    return prisma.post.findMany();
}

async function getAdminPostThroughId(id){
    return prisma.post.findUnique({
        where: { id },
    })
}

export { getUserById, getUserByUsername, getPublishedPosts, getPostsById, createPosts, updatePost, deletePostById, getCommentsByPostId, getCommentById, createCommentsByPostId, deleteCommentById, createUser, getAllPosts, getAdminPostThroughId }