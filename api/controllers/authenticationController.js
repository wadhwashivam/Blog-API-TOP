// The below two imports are required for postSignupPage function.
import bcrypt from "bcryptjs";
import * as db from "../database/queries.js";

// Below two imports are required for postLoginPage function.
import passport from "passport";
import jwt from "jsonwebtoken";
// Below import is only for validation of form.
import { body, validationResult } from "express-validator";

export const validationLogin = [
    body("username").trim().isEmail().withMessage("Must be a valid email.").escape(),
    body("password").isLength({ min: 6 }).withMessage("Password must be greater or equal to 6 characters."),
];

export const validateSignUp = [
    body("username").trim().isEmail().notEmpty().withMessage("Username must be a valid email address.").escape(),
    body("password").isLength({ min: 6 }).withMessage("Password must be greater or equal to 6 characters."),
    body("confirmPassword").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Password do not match.");
        }
        return true;
    }),
]

async function postSignupPage(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(401).json({ errors: errors.array() });
    }

    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser(username, hashedPassword);

        res.status(201).json({ message: "User Created" });        
    } catch (error) {
        next(error);
    }
}

async function postLoginPage(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({ errors: errors.array() });
    }

    passport.authenticate("local", { session: false}, (error, user, info) => {
        if (error){
            return next(error);
        }

        if (!user){
            return res.status(401).json({ message: info.message || "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.json({ token });
    })(req,res,next);
}

export { postSignupPage, postLoginPage };

