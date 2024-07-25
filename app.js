if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

//multer to handle multi part form data for parsing files and no other things 
//exclusive for multi part form data 
//url encoded can be for raw data only parsing only
//u can find this routes/listing.js

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");

const DB_URL = process.env.DB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})
async function main() {
    mongoose.connect(DB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
});

store.on("error", () => {
    console.log("Error --- Mongo Session Store", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }, 
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.use(session(sessionOptions));
app.use(flash());

//need sessions for passport -> obviously
app.use(passport.initialize());
app.use(passport.session());
//authenticate is login/signup which is added by default to users models
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //store info into session
passport.deserializeUser(User.deserializeUser()); //remove info from session

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.deleted = req.flash("deleted");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something Went Wrong!"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});