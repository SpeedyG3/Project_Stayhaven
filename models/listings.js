const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const { coordinates } = require('@maptiler/client');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true, 
    },
    description: String,
    image: {
        url: String, 
        filename: String, 
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'],
            required: true, 
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    price: Number,
    location: String, 
    country: String, 
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});
listingSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});
listingSchema.set('toJSON', { virtuals: true });

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;