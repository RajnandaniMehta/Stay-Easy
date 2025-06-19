import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import listingSchema from "../schema.js";
import Listing from "../models/listing.js";
import {isLoggedIn} from "../middleware.js";
// import flash from "connect-flash";

const router = express.Router();

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el) => el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new route
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs")
})
//show route
router.get("/:id",wrapAsync(async (req,res)=>{
   let {id}=req.params;
    const itemInfo=await Listing.findById(id).populate("reviews");
    if(!itemInfo){
        req.flash("error","Listing you requested for doesn't exist!");
       return  res.redirect("/listings");
    }
    res.render("listings/show.ejs",{itemInfo});
}));

//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
   const listing = new Listing(req.body.listing)
   await listing.save();
   req.flash("success","New Listing Created!");
   res.redirect("/listings");
   })
);
//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
if(!listing){
        req.flash("error","Listing you requested for edit doesn't exist!");
       return res.redirect("/listings");
    }
  res.render("listings/edit.ejs",{listing});
}));
//update route
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    let {id} =req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`)
}));

//deletee route

router.delete("/:id",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
     req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

export default router;