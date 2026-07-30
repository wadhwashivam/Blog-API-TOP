import { Router } from "express";
import * as authenticationController from "../controllers/authenticationController.js";

const authenticationRouter = Router();

authenticationRouter.post("/signup", authenticationController.validateSignUp, authenticationController.postSignupPage);

authenticationRouter.post("/login", authenticationController.validationLogin, authenticationController.postLoginPage);

export default authenticationRouter;