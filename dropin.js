
const mongoose = require("mongoose");
const dropin = new mongoose.Schema ({
    customerId : String,
    date : String,
    time : String,
    address : String,
    email : String,
})
const DropIn = new mongoose.model("DropIn", dropin);
module.exports = DropIn;