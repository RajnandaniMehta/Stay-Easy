import mongoose from "mongoose";
import Review from "./review.js";
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:String,
    image:{
       url:String,
       filename:String,
    },
    price:Number,
    location:String,
    history:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in:listingSchema.reviews}});
    }
    
})
const Listing=mongoose.model("Listing", listingSchema);
export default Listing;