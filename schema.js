const mongoose = require("mongoose");

const image = new mongoose.Schema ({
            image : String,
            code : String,
            status : String,
            name : String,
            id : String,
            delievery : String,
            statuscolor : String,
            dropcolor : String,
            email : String,
})
const Image = new mongoose.model("ImagePath", image);
module.exports = Image;
