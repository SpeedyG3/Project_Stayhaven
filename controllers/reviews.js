const Listing = require('../models/listings')
const Review = require("../models/reviews.js")

module.exports.addReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async(req, res) =>{
    let {id, rid} = req.params;
    // console.log(id);
    // console.log(rid);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: rid} });
    await Review.findByIdAndDelete(rid);
    req.flash("deleted", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};