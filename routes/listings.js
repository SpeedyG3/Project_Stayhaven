const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

//Cloud image uploading setup, //multer for file uploads
//cloudinary to store images 
const multer = require("multer");
const {storage, cloudinary} = require("../cloudinary/index.js");
// const upload = multer({dest: 'uploads/'}); //this is for locally storing files
//uploads folder deleted as we have no need for it
const upload = multer({storage});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        return next();
    }
};

//combining stuff with router.route
router
.route("/")
.get(wrapAsync(ListingController.index)) //INDEX 
.post(isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.new)); //CREATE
// .post(upload.single("listing[image]"), (req, res) => {
//     res.send(req.file); //access to file info with req.file
// }) //checking file upload locally with form using multer

//NEW
router.get("/new", isLoggedIn, ListingController.renderNew);

//SHOW 
router
.route("/:id")
.get(wrapAsync(ListingController.show)) //SHOW
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(ListingController.edit)) //UPDATE
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.delete)); //DELETE

//EDIT 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEdit));

module.exports = router;