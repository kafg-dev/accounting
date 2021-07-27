//jshint esversion:6
const mongoose = require("mongoose");
const companyCode = require(__dirname + "/companycode.js");
const glSeries = require(__dirname + "/gl-series.js");


const docSequenceSchema = new mongoose.Schema({
    account:String,
    companyCode:String,
    docNum:Number,
    docYear:Number
});

exports.docSequence = mongoose.model("docSequence", docSequenceSchema);


exports.getDocNumber = async function (docDetails) {
    const documentNumber = await exports.docSequence.findOneAndUpdate(
        {account:docDetails.account,companyCode:docDetails.companyCode,docYear:docDetails.docYear},
        // {account:"GL"},
        {$inc:{docNum:1}},
        {new:true}
    );
    return documentNumber.docNum;
};

exports.getDocSequence = async function () {
    const  docSequenceList = await exports.docSequence.find({});
    return docSequenceList;
};



exports.addDocSequence = async function(newDocYear,callback) {

    const companyCode_list = await companyCode.getCompanyCode();
    const glSeries_list = await glSeries.getGlSeries();
    const docSequence_list = await exports.getDocSequence();
    const listCount = companyCode_list.length;

        companyCode_list.forEach(function(companyCode) {
            glSeries_list.forEach(function(account){
                exports.docSequence.findOne({account:account.account,companyCode:companyCode._id,docYear:newDocYear}, function(err,docs) {
                   if(docs){
                       
                   } else {
                       const docValues = new exports.docSequence({
                            account:account.account,
                            companyCode:companyCode._id,
                            docNum:account.series,
                            docYear:newDocYear
                       });
    
                       docValues.save(function(err) {
                            if (err) {
                            }
                            else{
                            }
                            }); 
                   }

                });     
            }); 
        });
    
    return callback("1");


   
   
 

    


    // const docValues = {
    //     account:req.body.account,
    //     companyCode:req.body.companyCode,
    //     docYear:2021,
    //     status:"active"
    // };

  
    // newDocNumber.save(function(err) {
    //     if (err) {
    //         return callback("0");
    //     }
    //     else{
    //         return callback("1");
    //     }
    //     }); 
};

