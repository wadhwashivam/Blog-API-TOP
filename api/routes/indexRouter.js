import { Router } from "express";
import * as indexController from "../controllers/indexController.js";
import passport from "passport";

const indexRouter = Router();

// These 5 routes are posts only
indexRouter.get("/api/posts", indexController.getPosts);
indexRouter.get("/api/posts/:id", indexController.getPostsId);
indexRouter.post("/api/posts", passport.authenticate("jwt", { session: false }),indexController.postPosts);
indexRouter.put("/api/posts/:id", passport.authenticate("jwt", { session: false }), indexController.putPostsId);
indexRouter.delete("/api/posts/:id", passport.authenticate("jwt", { session: false }), indexController.deletePostsId);

// These 3 routes are for comments only
indexRouter.get("/api/posts/:id/comments", indexController.getPostsIdComments);
indexRouter.post("/api/posts/:id/comments", passport.authenticate("jwt", { session: false }), indexController.postPostsIdComments);
indexRouter.delete("/api/comments/:id", passport.authenticate("jwt", { session: false }), indexController.deleteCommentsId);

// These 2 routes are for admin only
indexRouter.get("/api/admin/posts", passport.authenticate("jwt", { session: false }), indexController.getAllPosts);
indexRouter.get("/api/admin/posts/:id", passport.authenticate("jwt", { session: false }), indexController.getAdminPostById);
export default indexRouter;