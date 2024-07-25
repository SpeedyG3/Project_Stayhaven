const Listing = require("../models/listings");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNew = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing Does Not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.new = async(req, res, next) => { 
    //req.file to get file
    // const campground = new Campground(req.body.campground);
    let url = req.file.path;
    let file = req.file.filename;
    const geoData = await maptilerClient.geocoding.forward(req.body.listing.location, { limit: 1 });
    const newListing = new Listing(req.body.listing);
    newListing.geometry = geoData.features[0].geometry;
    newListing.owner = req.user._id;
    newListing.image = {url, file};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEdit = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Does Not exist");
        res.redirect("/listings");
    }
    // let ogImg = listing.image.url;
    // ogImg = ogImg.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing});
};

module.exports.edit = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    const geoData = await maptilerClient.geocoding.forward(req.body.listing.location, { limit: 1 });
    listing.geometry = geoData.features[0].geometry;
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let file = req.file.filename;
        listing.image = {url, image};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated...");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Listing Deleted!");
    res.redirect("/listings");
};