//jshint esversion:6
const mongoose = require("mongoose");
const docSequence = require(__dirname + "/documentSequence.js");


const glTransactionSchema = new mongoose.Schema({
    documentNumber:String,
    documentDate:Date,
    postingDate:Date,
    reference:String,
    amount:String,
    text:String,
    companyCode:String,
    currency:String,
    companyName:String,
    debit:Number,
    credit:Number,
    transactionType:String,
    status:String,
    parker:String,
    poster:String,
    jEntry:[{
        glID:String,
        dcEntry:String,
        jAmount:String,
        costCenter:String
    }]
   
})

exports.glTransaction = mongoose.model("glTransaction", glTransactionSchema);


exports.getGlTransaction = async function () {
    const  GlTransactionList = await exports.glTransaction.find({});
    return GlTransactionList;
    
};

exports.addGLTransaction = function(newGlTransaction,callback) {
    var returnValue = {};
    newGlTransaction.save(function(err) {
        if (err) {
            returnValue.status = "0";
            return callback(returnValue);
        }
        else{
            returnValue.status = "1";
            returnValue.docNumber = newGlTransaction.documentNumber;
            return callback(returnValue);
        }
        }); 
};

exports.updateGLTransaction= function(toUpdateGlTransaction,callback) {

    exports.glTransaction.updateOne(
        {_id:toUpdateGlTransaction.documentID},
        {$set:toUpdateGlTransaction.documentValues},
        function(err) {
            if(err){
                return callback(err);
            } else {
                return callback("1");
            }
        });

};


