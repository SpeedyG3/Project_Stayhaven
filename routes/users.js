const express = require("express");
const router = express.Router();
const User = require('../models/users')
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");

//signup
router
.route("/signup")
.get(UserController.getSignup) //get signup form 
.post(wrapAsync(UserController.signUp)); //signup

//login
router
.route("/login")
.get(UserController.getLogin) //get login form
.post(saveRedirectUrl, 
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    wrapAsync(UserController.login)); //login

router.get("/logout", UserController.logout);

module.exports = router;