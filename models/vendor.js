//jshint esversion:6

const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    vendorCode:{
        type:String,
        index:{unique:true,sparse:true}
    },
   vendorName:String,
   vendorCompanyCode:[String],
   vendorCurrency:String,
   vendorTaxCategory:String,
   vendorPaymentTerm:String,
   vendorTax:String,
   vendorRecon:String,
   vendorStreet:String,
   vendorCity:String,
   vendorCountry:String,
   vendorPostalCode:String,
   vendorTelephone:String,
   vendorEmail:String,
   vendorWebsite:String
})

exports.vendor = mongoose.model("vendor", vendorSchema);

exports.getVendor = async function () {
    const  vendorList = await exports.vendor.find({});
    return vendorList;
};

exports.addVendor = function(newVendor,callback) {
  
    newVendor.save(function(err) {
        if (err) {
            return callback("0");
        }
        else{
            return callback("1");
        }
        }); 

};

exports.updateVendor= function(toUpdateVendor,callback) {

    exports.vendor.updateOne(
        {_id:toUpdateVendor.vendorCode},
        {$set:toUpdateVendor.vendorValues},
        function(err) {
            if(err){
                return callback(err);
            } else {
                return callback("1");
            }
        });

};

exports.deleteVendor = function(toDeleteVendor, callback){
    
    exports.vendor.findByIdAndRemove(
        toDeleteVendor,
           function(err) {
               if(err){
                   return callback(err);
               } else {
                   return callback("1");
               }
           });
};

