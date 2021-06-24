//jshint esversion:6

const mongoose = require("mongoose");

const glAccountSchema = new mongoose.Schema({
    country:String,
    companyCode:String,
    currency:String
})

module.exports = mongoose.model("glAccount", glAccountSchema);


