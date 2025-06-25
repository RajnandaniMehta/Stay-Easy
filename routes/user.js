import express from "express";
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import {saveRedirctUrl} from "../middleware.js";
import userController from "../controllers/users.js";

const router = express.Router({mergeParams : true});

router.route("/signup")
.get(userController.signupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.loginform)
.post(saveRedirctUrl, passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),wrapAsync(userController.login));

router.get("/logout",userController.logout)
export default router;