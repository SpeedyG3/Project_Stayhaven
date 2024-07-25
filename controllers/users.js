const User = require('../models/users')

module.exports.getSignup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", `Welcome ${username}!`);
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.getLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    let {username} = req.body;
    req.flash("success", `Welcome ${username}!`);
    let redirectUrl = res.locals.redirectUrl
    if(!redirectUrl){
        redirectUrl = "/listings"
    }
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};