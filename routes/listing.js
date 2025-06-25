import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import listingController from "../controllers/listings.js";
import multer from "multer";
import {storage} from "../cloudConfig.js";
const upload=multer({storage});

const router = express.Router();
router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.createListing));
.post(upload.single("listing[image]"), (req, res, next) => {
  if (!req.file) return res.status(400).send("No file uploaded!");
  console.log(req.file);
  res.send("Upload successful!");
});


//new route
router.get("/new", isLoggedIn,listingController.newRenderForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));


export default router;