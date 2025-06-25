import Listing from "../models/listing.js";
export const index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

export const newRenderForm=(req, res) => {
    res.render("listings/new.ejs")
}

export const showListing=async (req, res) => {
    let { id } = req.params;
    const itemInfo = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!itemInfo) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { itemInfo });
}

export const createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.url.filename;
    const listing = new Listing(req.body.listing)
    listing.owner = req.user._id;
    listing.image={url,filename};
    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

export const editForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for edit doesn't exist!");
        return res.redirect("/listings");
    }
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/h_300,w_250");
    console.log(originalUrl);
    res.render("listings/edit.ejs", { listing,originalUrl });
}

export const updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof(req.file)!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
   
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`)
}

export const deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

const listingController={index,newRenderForm,showListing,createListing,editForm,updateListing,deleteListing};
export default listingController;