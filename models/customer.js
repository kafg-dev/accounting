//jshint esversion:6

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerCode:{
        type:String,
        index:{unique:true,sparse:true}
    },
   customerName:String,
   customerCompanyCode:String,
   customerCurrency:String,
   customerTaxCategory:String,
   customerPaymentTerm:String,
   customerTax:String,
   customerRecon:String,
   customerStreet:String,
   customerCity:String,
   customerCountry:String,
   customerPostalCode:String,
   customerTelephone:String,
   customerEmail:String,
   customerWebsite:String
})

exports.customer = mongoose.model("customer", customerSchema);

exports.getCustomer = async function() {
    const customerList = await exports.customer.find({});
    return customerList;
}

exports.addCustomer = function(newCustomer,callback) {

    newCustomer.save(function(err){
        if(err) {
            return callback("0");
        } else {
            return callback("1");
        }
    });
}

exports.updateCustomer = function(toUpdateCustomer,callback) {

    exports.customer.updateOne(
        {_id:toUpdateCustomer.customerCode},
        {$set:toUpdateCustomer.customerValues},
        function(err){
            if(err){
                return callback(err);
            } else {
                return callback("1");
            }
        });
}

exports.deleteCustomer = function(toDeleteCustomer,callback){

    exports.customer.findByIdAndRemove(
        toDeleteCustomer,
        function(err){
            if(err){
                return callback("0");
            }else {
                return callback("1");
            }
        });
}
