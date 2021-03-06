//jshint esversion:6

const mongoose = require("mongoose");

const docSequence = require(__dirname + "/documentSequence.js");

const companyCodeSchema = new mongoose.Schema({
    code:String,
    country:{
        type: String,
        required: true
      },
    company:{
        type:String,
        index:{unique:true,sparse:true}
      },
    currency:{
        type: String,
        required: true
      }
})

exports.cCode = mongoose.model("companycode", companyCodeSchema);

exports.getCompanyCode = async function () {
    const  companyCodeList = await exports.cCode.find({});
    return companyCodeList;
}

exports.addCompanyCode = function(companyCode,callback) {

    ////////////////////////////////////////////////////////////////////------save--------////////////////
        exports.cCode.findOne({code:companyCode.code},function(err,codes) {
            if (codes) {
                return callback("0");
            } else {
                companyCode.save(function(err,result) {
                    if (err) {
                        return callback(err);
                    }
                    else{
                        
                        return callback("1");
                    }
                    }); 
            }
        });
    ////////////////////////////////////////////////////////////////////------save end--------/////////////

};

exports.updateCompanyCode = function(companyCode,callback) {
    
    ////////////////////////////////////////////////////////////////////------update--------////////////////
   
   ///CHECK IF CODE EXISTS
    exports.cCode.findOne({code:companyCode.code,_id: { $ne: companyCode._id }},function(err,codes) {
        if (codes) {
            return callback("0");
        } else {
            let theID = companyCode._id; 
            exports.cCode.findByIdAndUpdate(
                 theID,
                {code:companyCode.code,company:companyCode.company,country:companyCode.country,currency:companyCode.currency},
                { new: true },
                function(err,modelY) {
                    if(err){
                        return callback(err);
                        console.log(err);
                    } else {
                        return callback("1");
                        console.log("okay");
                    }
                });
            
        }
    });
   
   
////////////////////////////////////////////////////////////////////------update end--------/////////////
}

exports.deleteCompanyCode = function(companyCode,callback) {

    ////////////////////////////////////////////////////////////////////------delete--------////////////////
   exports.cCode.findByIdAndRemove(
       companyCode,
       function(err) {
           if(err){
               return callback(err);
           } else {
               return callback("1");
           }
       });
////////////////////////////////////////////////////////////////////------delete end--------/////////////


}
