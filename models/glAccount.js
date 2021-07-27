//jshint esversion:6

const mongoose = require("mongoose");

const glAccountSchema = new mongoose.Schema({
    glAccount:{
        type:String,
        index:{unique:true,sparse:true}
    },
    glName:String,
    companyCode:[String],
    accountCurrency:String,
    accountType:String,
    taxCategory:String,
    accountGroup:String,
    descShort:String,
    descLong:String
    
})

exports.glAccount = mongoose.model("glAccount", glAccountSchema);

exports.getGlAccount = async function () {
    const  glAccountList = await exports.glAccount.find({});
    return glAccountList;
};

exports.addGlAccount = function(newGlAccount,callback) {
  
    newGlAccount.save(function(err) {
        if (err) {
            return callback("0");
        }
        else{
            return callback("1");
        }
        }); 

};

exports.updateGlAccount= function(toUpdateGlAccount,callback) {

    exports.glAccount.updateOne(
        {_id:toUpdateGlAccount.glAccount},
        {$set: toUpdateGlAccount.glAccountValues},
        function(err) {
            if(err){
                return callback(err);
            } else {
                return callback("1");
            }
        });

};

exports.deleteGlAccount = function(toDeleteGlAccount, callback){
    
    exports.glAccount.findByIdAndRemove(
        toDeleteGlAccount,
           function(err) {
               if(err){
                   return callback(err);
               } else {
                   return callback("1");
               }
           });
};

