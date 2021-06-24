//jshint esversion:6
const mongoose = require("mongoose");

exports.accountGroupSchema = new mongoose.Schema({
    accountGroup:String,
    rangeFrom:Number,
    rangeTo:Number
});

exports.accountGroup = mongoose.model("glAccountGroup",exports.accountGroupSchema);

exports.getAccountGroup = function(callback) {

    ////////////////////////////////////////////////////////////////////------find--------/////////////
   exports.accountGroup.find({},function(err,accounts) {
       if (err) {
           return callback(err);
       }
       else{
           return callback(accounts);
       }
   });
   ////////////////////////////////////////////////////////////////////------find end--------/////////////

};