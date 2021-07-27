//jshint esversion:6

const mongoose = require ("mongoose");

const controlSchema = new mongoose.Schema({
        accountType:String,
        companyCode:String,
        fromAccount:String,
        toAccount:String,
        fromPeriod:String,
        toPeriod:String,
        controlYear:Number,
        status:String
})

exports.controlPeriod = mongoose.model("controlPeriod",controlSchema);

exports.getControlPeriod = async function() {
    const control_List = await exports.controlPeriod.find({});
    return control_List;
}

exports.addControlPeriod = function (newControl,callback) {
 exports.controlPeriod.findOne({accountType:newControl.accountType,companyCode:newControl.companyCode,fromAccount:newControl.fromAccount,toAccount:newControl.toAccount,fromPeriod:newControl.fromPeriod,toPeriod:newControl.toPeriod,controlYear:newControl.controlYear}, function(err,foundItems) {
     if(foundItems) {
        return callback("0"); 
     } else {
        newControl.save(function (err) {
            if(!err) {
                return callback("1");
            }
        })
     }
 });
    
}

exports.updateControlPeriod = function(toUpdateControlPeriod,callback) {
// _id: { $ne:accountType._id }
 var vals = toUpdateControlPeriod.periodValues;
 exports.controlPeriod.findOne({accountType:vals.accountType,companyCode:vals.companyCode,fromAccount:vals.fromAccount,toAccount:vals.toAccount,fromPeriod:vals.fromPeriod,toPeriod:vals.toPeriod,controlYear:vals.controlYear,_id: { $ne:toUpdateControlPeriod.periodId }}, function(err,foundItems) {
    if(foundItems) {
        return callback("0"); 
     } else {
        exports.controlPeriod.updateOne(
            {_id:toUpdateControlPeriod.periodId},
            {$set:vals},
            function(err){
                if(err){
                    return callback(err);
                } else {
                    return callback("1");
                }
            });
     }

});
}

exports.deleteControlPeriod = function(toDeleteControlPeriod,callback) {

    exports.controlPeriod .findByIdAndRemove(
        toDeleteControlPeriod,
           function(err) {
               if(err){
                   return callback(err);
               } else {
                   return callback("1");
               }
           });
}