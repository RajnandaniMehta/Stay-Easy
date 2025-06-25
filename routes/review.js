import express from "express";
import wrapAsync from "../utils/wrapAsync.js"
import {isAuthor, isLoggedIn, validateReview} from "../middleware.js";
import { createReview, deleteReview} from "../controllers/reviews.js";
const router = express.Router({mergeParams : true});



//post review route
router.post("/",isLoggedIn, validateReview,wrapAsync(createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(deleteReview));

export default router;