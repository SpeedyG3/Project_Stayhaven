const express = require("express");
const router = express.Router({mergeParams: true});
const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    }else{
        next();
    }
}

//CREATE
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.addReview));

//DELETE
router.delete("/:rid", isLoggedIn, isAuthor, wrapAsync(ReviewController.deleteReview));

module.exports = router;