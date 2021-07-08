//jshint esversion:6
const { data } = require("currency-codes");
const mongoose = require("mongoose");

const glAccTypeSchema = new mongoose.Schema({
    accountType:String,
    rangeFrom:Number,
    rangeTo:Number,
    accountGroup:[{
        accountGroup:{
            type:String,
            index:{unique:true,sparse:true}
        }
        // rangeFrom:Number,
        // rangeTo:Number,
    }]
})


exports.accountType = mongoose.model("glAccountType", glAccTypeSchema);


exports.getAccountType = async function () {
    const  accountTypeList = await exports.accountType.find({});
    return accountTypeList;
    
};

// exports.getAccountType = function(callback) {

//      ////////////////////////////////////////////////////////////////////------find--------/////////////
//     exports.accountType.find({},function(err,accounts) {
//         return callback(accounts);
//         if (err) {
//             return callback(err);
//         }
//         else{
//             return callback(accounts);
//         }
//     });
//     ////////////////////////////////////////////////////////////////////------find end--------/////////////

// };
   
var checkRange = function(vals,callback){
    let ctr = null;
    let rangeCheck = 1;
    let accountTypeID = vals.accountTypeID;
    let rangeFrom = vals.rangeFrom;
    let rangeTo = vals.rangeTo;
    let resp = [];

    exports.accountType.find({},function(err,foundAccounts) {
        if (foundAccounts.length===0){ 
        } else {
                foundAccounts.forEach(function(accounts) {

                        if(accounts._id==accountTypeID){

                        } else {
                                ctr = 1;
                                if ((rangeFrom >= accounts.rangeFrom && rangeFrom <=accounts.rangeTo) && (rangeTo >= accounts.rangeFrom && rangeTo <=accounts.rangeTo))
                                { 
                                    rangeCheck = 0;
                                }
                                else{
                                  
                                    if ((accounts.rangeFrom >= rangeFrom  && accounts.rangeFrom <= rangeTo ) && (accounts.rangeTo >= rangeFrom  && accounts.rangeTo <= rangeTo ))
                                    {
                                        rangeCheck = 0;
                                       
                                    } else{ 
                                      
                                        if ((rangeFrom >= accounts.rangeFrom && rangeFrom <= accounts.rangeTo) || (rangeTo >= accounts.rangeFrom && rangeTo <=accounts.rangeTo))
                                        {
                                            rangeCheck = 0;
                                           
                                        }
                                    }
                                }
                           
                        }    
                }); 

                            resp.rangeCheck = rangeCheck;
                            resp.ctr = ctr;
         }                  return callback(resp);

    });
                                            
} 

exports.addAccountType = function(newAccountType,callback) {
     
    let rangeFrom = newAccountType.rangeFrom;
    let rangeTo = newAccountType.rangeTo;
    let accountTypeId="";
    let vals = {rangeFrom,rangeTo,accountTypeId}
   
    ////////////////////////////////////////////////////////////////////------save--------////////////////
        exports.accountType.findOne({accountType:newAccountType.accountType},function(err,accountType) {
            if (accountType) {
                return callback("0");
            } else {
                  checkRange(vals, function(rangeCheckResult) {
                    if((!rangeCheckResult.ctr) || (rangeCheckResult.rangeCheck))
                    {   
                        newAccountType.save(function(err) {
                        if (err) {
                            return callback(err);
                        }
                        else{
                            return callback("1");
                        }
                        }); 

                    }else {
                        return callback("01");
                    }
                   
                });   
                
            }
        });
    ////////////////////////////////////////////////////////////////////------save end--------/////////////

};

exports.updateAccountType = function(accountType,callback) {
    
    ////////////////////////////////////////////////////////////////////------update--------////////////////
    exports.accountType.findOne({accountType: accountType.accountType,_id: { $ne:accountType._id } },function(err,accountTypeRes) {
        if (accountTypeRes) {
            return callback("0");
        } else {
             checkRange(vals, function(rangeCheckResult) {
                    if((!rangeCheckResult.ctr) || (rangeCheckResult.rangeCheck))
                    {   
                        let theID = accountType._id; 
                        exports.accountType.updateOne(
                            {_id:theID},
                            {$set: accountType.accountTypeValues},
                            function(err) {
                                if(err){
                                    return callback(err);
                                } else {
                                    return callback("1");
                                }
                            });

                    }else {
                        return callback("01");
                    }
                   
                });     
            
        }
    });

////////////////////////////////////////////////////////////////////------update end--------/////////////
}

exports.deleteAccountType = function(accountTypeID,callback) {

    ////////////////////////////////////////////////////////////////////------delete--------////////////////
   exports.accountType.findByIdAndRemove(
    accountTypeID,
       function(err) {
           if(err){
               return callback(err);
           } else {
               return callback("1");
           }
       });
////////////////////////////////////////////////////////////////////------delete end--------/////////////


}

// ACCOUNTGROUP

exports.getAccountGroup = function(callback) {

    ////////////////////////////////////////////////////////////////////------find--------/////////////
   exports.accountType.find({},function(err,accounts) {
       if (err) {
           return callback(err);
       }
       else{
           return callback(accounts);
       }
   });
   ////////////////////////////////////////////////////////////////////------find end--------/////////////

};

exports.addAccountGroup = function(newAccountGroup,callback) {

    let accountGroupName = newAccountGroup.accountGroup;
    let accountGrouptypeID = newAccountGroup.accountTypeID;
    let accountGroupValues = newAccountGroup.accountGroupValues;
    // let accountGroupID = "";
    // let vals = {accountGrouptypeID,accountGroupID,accountGroupValues};
   
    ////////////////////////////////////////////////////////////////////------save--------////////////////
        exports.accountType.find({"accountGroup.accountGroup":accountGroupName},function(err,foundAccountGroup) {
            if(foundAccountGroup.length===0){

                exports.accountType.findOne({_id:accountGrouptypeID}, function(err,foundAccount) {
                    foundAccount.accountGroup.push(accountGroupValues);
                        foundAccount.save(function(err) {
                            if (err) {
                                return callback(err);     
                            }
                            else{
                                return callback("1");
                               
                            }
                        });
                }); 

                     
            }else {
                return callback("0");
            }
        });
    ////////////////////////////////////////////////////////////////////------save end--------/////////////
};

exports.updateAccountGroup = function(toUpdateAccountGroup,callback) {

    let accountGrouptypeID = toUpdateAccountGroup.accountGrouptypeID;
    let accountGroupID = toUpdateAccountGroup.accountGroupID;
    let accountGroupValues = toUpdateAccountGroup.accountGroupValues;
    let vals = {accountGrouptypeID,accountGroupID,accountGroupValues};

    ////////////////////////////////////////////////////////////////////------update--------////////////////
     //if account type is same
    exports.accountType.findOne({_id:accountGrouptypeID,"accountGroup._id":accountGroupID},function(err,foundAccount) {
       
        if(foundAccount){
            exports.accountType.findOneAndUpdate(
                {  _id: accountGrouptypeID },
                { $set: { "accountGroup.$[outer]": accountGroupValues } },
                { "arrayFilters": [{"outer._id": accountGroupID}]},function(err,done) {
                    if (!err){
                        return callback("1");
                    } else {
                        return callback("0");
                    }
                }); 
                // checkRange(vals, function(rangeCheckResult) {
                //    if (rangeCheckResult.rangeCheck){
                       
                //    } else {
                //        return callback("01");
                //    }
                // });
              
        } else {
            
        }

    });
////////////////////////////////////////////////////////////////////------update end--------/////////////
}

exports.deleteAccountGroup = function(accountGroupValues,callback) {

    let accountGroupTypeID = accountGroupValues.accountGrouptypeID;
    let accountGroupID = accountGroupValues.accountGroupID;
    
    ////////////////////////////////////////////////////////////////////------delete--------////////////////
    exports.accountType.findOneAndUpdate(
        {  _id: accountGroupTypeID },
        { $pull: {accountGroup: {_id:accountGroupID}}},function(err) {
            if (!err){
                return callback("1");
                
            } else {
                return callback("0");
            }
        }); 
////////////////////////////////////////////////////////////////////------delete end--------/////////////


}