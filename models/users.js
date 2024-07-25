const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String, 
        required: true,
    },
});

//passport local mongoose adds usn, hash and salt 
//adds a few methods too
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
