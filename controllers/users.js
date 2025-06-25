import User from "../models/user.js"
export const signupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

export const signup=async(req,res)=>{
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
}

export const loginform=(req,res)=>{
    res.render("users/login.ejs");
}

export const login=async(req,res)=>{
    try{
        req.flash("success","Welcome to AnbInb");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/login");
    }
}

export const logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have successfully logout");
        res.redirect("/listings");
    })
}
const userController={login, loginform, logout, signup, signupForm };
export default userController;