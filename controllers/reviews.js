import Listing from "../models/listing.js";
import Review from "../models/review.js";
export const createReview=async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
     req.flash("success","New review Created!");
   res.redirect(`/listings/${req.params.id}`)
}

export const deleteReview=async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
}