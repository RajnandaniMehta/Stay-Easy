import express from "express";
import User from "../models/user.js"
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import {saveRedirctUrl} from "../middleware.js";

const router = express.Router({mergeParams : true});

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const reguser=await User.register(newUser,password);
    console.log(reguser);
    req.login(reguser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user is registered successfully");
        res.redirect("/listings");
    }); 
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",saveRedirctUrl, passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),wrapAsync(async(req,res)=>{
    try{
        req.flash("success","Welcome to AnbInb");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/login");
    }
}));
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have successfully logout");
        res.redirect("/listings");
    })
})
export default router;