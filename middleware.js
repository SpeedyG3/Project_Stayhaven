const Listing = require("./models/listings");
const Review = require("./models/reviews");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //save redirect url
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }else{
        return next();
    };
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission for this action");
        return res.redirect(`/listings/${id}`);
    }
    return next();
};

module.exports.isAuthor = async (req, res, next) => {
    let {id, rid} = req.params;
    let review = await Review.findById(rid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission for this action");
        return res.redirect(`/listings/${id}`);
    }
    return next();
};