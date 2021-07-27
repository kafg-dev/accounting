//jshint esversion:6
const mongoose = require("mongoose");

const glSeriesSchema = new mongoose.Schema({
    account:{
        type:String,
        index:{unique:true,sparse:true}
    },
    series:{
        type:Number,
        index:{unique:true,sparse:true}
    }
})

exports.glSeries = mongoose.model("glSeries", glSeriesSchema);

exports.getGlSeries = async function () {
    const  glSeriesList = await exports.glSeries.find({});
    return glSeriesList;
};

exports.addGlSeries = function(newGlSeries,callback) {
  
    newGlSeries.save(function(err) {
        if (err) {
            return callback("0");
        }
        else{
            return callback("1");
        }
        }); 
};

exports.updateGlSeries = function(toUpdateGlSeries,callback) {

    exports.glSeries.updateOne(
        {account:toUpdateGlSeries.account},
        {$set: toUpdateGlSeries},
        function(err) {
            if(err){
                return callback("0");
            } else {
                return callback("1");
            }
        });
};

exports.deleteGlSeries = function(toDeleteGlSeries,callback) {

    exports.glSeries.findByIdAndRemove(
        toDeleteGlSeries,
           function(err) {
               if(err){
                   return callback("0");
               } else {
                   return callback("1");
               }
           });
};