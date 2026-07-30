import * as db from "../database/queries.js";

async function getPosts(req,res,next){
    try{
        const posts = await db.getPublishedPosts();
        res.json(posts);
    }catch(error){
        next(error);
    }
}

async function getPostsId(req,res,next){
    try{
        const post = await db.getPostsById(req.params.id);
        res.json(post);
    }catch(error){
        next(error);
    }
}

async function postPosts(req, res, next){
    try{
        const { title, content, published } = req.body;
        const authorId  = req.user.id;
        const newPost = await db.createPosts(title, content, published, authorId);
        res.status(201).json(newPost);
    }catch(error){
        next(error);
    }
}

async function putPostsId(req,res,next){
    try {
        const id = req.params.id;
        const { title, content, published } = req.body;

        const updates = {};
        if (title !== undefined){
            updates.title = title;
        }
        if (content !== undefined){
            updates.content = content;
        }
        if (published !== undefined){
            updates.published = published;
        }

        const updatedPost = await db.updatePost(id, updates);
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
}

async function deletePostsId(req,res,next){
    try {
        const id = req.params.id;
        await db.deletePostById(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function getPostsIdComments(req,res,next){
    try {
        const id = req.params.id;
        const comments = await db.getCommentsByPostId(id);
        res.json(comments);
    } catch (error) {
        next(error);
    }
}

async function postPostsIdComments(req,res,next){
    try {
        const id = req.params.id; // Getting the post id not comment
        const { content } = req.body;
        const authorId = req.user.id;
        const newComment = await db.createCommentsByPostId(content, authorId, id);
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
}

async function deleteCommentsId(req,res,next){
    try {
        const id = req.params.id;
        await db.deleteCommentById(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function getAllPosts(req,res,next){
    try {
        const posts = await db.getAllPosts();
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function getAdminPostById(req,res,next){
    try{
        const postId = req.params.id;

        const post = await db.getAdminPostThroughId(postId);

        res.json(post);
    }catch(error){
        next(error);
    }
}

export { getPosts, getPostsId, postPosts, putPostsId, deletePostsId, getPostsIdComments, postPostsIdComments, deleteCommentsId, getAllPosts, getAdminPostById };
