const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js")

const DB_URL = "mongodb://127.0.0.1:27017/stayhaven"
main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})
async function main() {
    mongoose.connect(DB_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    const geometry = {
        type: "Point",
        coordinates: [
            -118.2436849,
            34.0522342,
        ],
    };
    initData.data = initData.data.map((obj) => ({...obj, owner: "66930c73ed01e9f6c07ca298", geometry: geometry}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();