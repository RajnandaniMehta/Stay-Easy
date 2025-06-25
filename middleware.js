import Listing from "./models/listing.js";
import ExpressError from "./utils/ExpressError.js";
import listingSchema from "./schema.js";
import { reviewSchema } from "./schema.js";
import Review from "./models/review.js";
export const isLoggedIn=(req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create post");
        return res.redirect("/login");
    }
    next();
}

export const saveRedirctUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

export const isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

export const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

export const isAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the Author");
        return res.redirect(`/listings/${id}`);
    }
    next();
}