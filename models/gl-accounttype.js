//jshint esversion:6
const mongoose = require("mongoose");

exports.accountGroupSchema = new mongoose.Schema({
    accountGroup:String,
    rangeFrom:Number,
    rangeTo:Number
});

exports.accountGroup = mongoose.model("glAccountGroup",exports.accountGroupSchema);

const glAccTypeSchema = new mongoose.Schema({
    accountType:String,
    accountGroup:[exports.accountGroupSchema]
})

exports.accountType = mongoose.model("glAccountType", glAccTypeSchema);

exports.getAccountType = function(callback) {

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

exports.addAccountType = function(newAccountType,callback) {

   
    ////////////////////////////////////////////////////////////////////------save--------////////////////
        exports.accountType.findOne({accountType:newAccountType.accountType},function(err,accountType) {
            if (accountType) {
                return callback("0");
            } else {
                newAccountType.save(function(err) {
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

exports.updateAccountType = function(accountType,callback) {
    
    ////////////////////////////////////////////////////////////////////------update--------////////////////
    exports.accountType.findOne({accountType: accountType.accountType,_id: { $ne:accountType._id } },function(err,accountTypeRes) {
        if (accountTypeRes) {
            return callback("0");
        } else {
            let theID = accountType._id; 
            exports.accountType.updateOne(
                {_id:theID},
                {$set:{accountType:accountType.accountType}},
                function(err) {
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

    let accountGroupName = newAccountGroup.accountGroupValues.accountGroup;
    let accountTypeID = newAccountGroup.accountTypeID;
    let newaccountGroupArray = newAccountGroup.accountGroupValues;
    let rangeFrom = newaccountGroupArray.rangeFrom;
    let rangeTo= newaccountGroupArray.rangeTo;
    let ctr = null;
    let rangeCheck = 1;
   
    ////////////////////////////////////////////////////////////////////------save--------////////////////
        exports.accountType.find({"accountGroup.accountGroup":accountGroupName},function(err,foundAccountGroup) {
            if(foundAccountGroup.length===0){
                exports.accountType.find({},function(err,foundAccounts) {
                        foundAccounts.forEach(function(accounts) {
                            for (var x=0;x <= accounts.accountGroup.length-1; x++) {
                                if (accounts.accountGroup.length===0){ 
                                    console.log("ctr empty - go upload");
                                } 
                                else {
                                    ctr = "1";
				                    console.log(rangeFrom +" >= " +accounts.accountGroup[x].rangeFrom +" && "+ rangeFrom +" <= "+ accounts.accountGroup[x].rangeTo +" ||  "+ rangeTo +" >= "+ accounts.accountGroup[x].rangeFrom + " && " + rangeTo + " <= " + accounts.accountGroup[x].rangeTo);
                                    //if true = number falls in range
                                    if ((rangeFrom >= accounts.accountGroup[x].rangeFrom && rangeFrom <=accounts.accountGroup[x].rangeTo) && (rangeTo >= accounts.accountGroup[x].rangeFrom && rangeTo <=accounts.accountGroup[x].rangeTo))
                                    { 
                                        rangeCheck = 0;
                                        console.log("First true no upload" +rangeCheck );
                                    }
                                    else{
                                        //if true = number falls in range
                                        // console.log(accounts.accountGroup[x].rangeFrom + ">=" +rangeFrom +" && "+ accounts.accountGroup[x].rangeFrom + "<=" + rangeTo  +" && "+ accounts.accountGroup[x].rangeTo + ">=" + rangeFrom  +" && "+ accounts.accountGroup[x].rangeTo + "<=" + rangeTo );
                                        if ((accounts.accountGroup[x].rangeFrom >= rangeFrom  && accounts.accountGroup[x].rangeFrom <= rangeTo ) && (accounts.accountGroup[x].rangeTo >= rangeFrom  && accounts.accountGroup[x].rangeTo <= rangeTo ))
                                        {
                                            rangeCheck = 0;
                                            console.log("First false,second true no upload" +rangeCheck );
                                        } else{ 
                                            console.log(rangeFrom +" >= " +accounts.accountGroup[x].rangeFrom +" || "+ rangeFrom +" <= "+ accounts.accountGroup[x].rangeTo +" ||  "+ rangeTo +" >= "+ accounts.accountGroup[x].rangeFrom + " || " + rangeTo + " <= " + accounts.accountGroup[x].rangeTo);
                                            if ((rangeFrom >= accounts.accountGroup[x].rangeFrom && rangeFrom <= accounts.accountGroup[x].rangeTo) || (rangeTo >= accounts.accountGroup[x].rangeFrom && rangeTo <=accounts.accountGroup[x].rangeTo))
                                            {
                                                rangeCheck = 0;
                                                console.log("First false,second true, third true no upload " +rangeCheck );
                                            }
                                            else{
                                               
                                                console.log("First false,second true, third false go upload " +rangeCheck );
                                            }
                                            
                                        }
                                    }
                                }   
                            }
                              
                             
                        }); 
                        
                                if (!ctr) {
                                   exports.accountType.findOne({_id:accountTypeID}, function(err,foundAccount) {
                                       foundAccount.accountGroup.push(newaccountGroupArray);
                                           foundAccount.save(function(err) {
                                               if (err) {
                                                   return callback("error");
                                               }
                                               else{
                                                   return callback("1");
                                                
                                               }
                                           });
                                       });
                               } else {
                                   if (rangeCheck) {
                                       exports.accountType.findOne({_id:accountTypeID}, function(err,foundAccount) {
                                           foundAccount.accountGroup.push(newaccountGroupArray);
                                               foundAccount.save(function(err) {
                                                   if (err) {
                                                       return callback("error");
                                                   }
                                                   else{
                                                       return callback("1");
                                                    
                                                   }
                                               });
                                           }); 
                                   } else {
                                       return callback("01");
                                   }
                               }          
                }); 

              
                
            }

            else {
                return callback("0");
            }
        });
    ////////////////////////////////////////////////////////////////////------save end--------/////////////
};

exports.updateAccountGroup = function(toUpdateAccountGroup,callback) {


    let accountGrouptypeID = toUpdateAccountGroup.accountGrouptypeID;
    let accountGroupID = toUpdateAccountGroup.accountGroupID;
    let accountGroupValues = toUpdateAccountGroup.accountGroupValues;
    let rangeFrom = accountGroupValues.rangeFrom;
    let rangeTo = accountGroupValues.rangeTo;
    let ctr = null;
    let rangeCheck = 1;

    ////////////////////////////////////////////////////////////////////------update--------////////////////
    exports.accountType.find({'accountGroup.accountGroup': 'hello there'},{'accountGroup.accountGroup.$': 1,'accountGroup._id':1,_id:0},function(err,foundAccount) {

        var k = foundAccount.[0];
        console.log(k);

    });
    //  exports.accountType.findOne({"accountGroup._id":{$ne:"60d3fbfbc1502c3ed8cadf86"},"accountGroup.accountGroup":"hahaha"},function(err,foundAccountGroup) {

    //     console.log(foundAccountGroup);
                // if(foundAccountGroup){
                //     return callback("0");
                // } else {
                //             exports.accountType.find({},function(err,foundAccounts) {
                //                 foundAccounts.forEach(function(accounts) {
                //                     for (var x=0;x <= accounts.accountGroup.length-1; x++) {
                //                         if (accounts.accountGroup.length===0){ 
                //                         } 
                //                         else {
                                            
                //                             console.log(rangeFrom +" >= " +accounts.accountGroup[x].rangeFrom +" && "+ rangeFrom +" <= "+ accounts.accountGroup[x].rangeTo +" ||  "+ rangeTo +" >= "+ accounts.accountGroup[x].rangeFrom + " && " + rangeTo + " <= " + accounts.accountGroup[x].rangeTo);
                //                             //if true = number falls in range
                //                             if ((rangeFrom >= accounts.accountGroup[x].rangeFrom && rangeFrom <=accounts.accountGroup[x].rangeTo) && (rangeTo >= accounts.accountGroup[x].rangeFrom && rangeTo <=accounts.accountGroup[x].rangeTo))
                //                             { 
                //                                 rangeCheck = 0;
                //                                 console.log("First true no upload" +rangeCheck );
                //                             }
                //                             else{
                //                                 //if true = number falls in range
                //                                 // console.log(accounts.accountGroup[x].rangeFrom + ">=" +rangeFrom +" && "+ accounts.accountGroup[x].rangeFrom + "<=" + rangeTo  +" && "+ accounts.accountGroup[x].rangeTo + ">=" + rangeFrom  +" && "+ accounts.accountGroup[x].rangeTo + "<=" + rangeTo );
                //                                 if ((accounts.accountGroup[x].rangeFrom >= rangeFrom  && accounts.accountGroup[x].rangeFrom <= rangeTo ) && (accounts.accountGroup[x].rangeTo >= rangeFrom  && accounts.accountGroup[x].rangeTo <= rangeTo ))
                //                                 {
                //                                     rangeCheck = 0;
                //                                     console.log("First false,second true no upload" +rangeCheck );
                //                                 } else{ 
                //                                     console.log(rangeFrom +" >= " +accounts.accountGroup[x].rangeFrom +" || "+ rangeFrom +" <= "+ accounts.accountGroup[x].rangeTo +" ||  "+ rangeTo +" >= "+ accounts.accountGroup[x].rangeFrom + " || " + rangeTo + " <= " + accounts.accountGroup[x].rangeTo);
                //                                     if ((rangeFrom >= accounts.accountGroup[x].rangeFrom && rangeFrom <= accounts.accountGroup[x].rangeTo) || (rangeTo >= accounts.accountGroup[x].rangeFrom && rangeTo <=accounts.accountGroup[x].rangeTo))
                //                                     {
                //                                         rangeCheck = 0;
                //                                         console.log("First false,second true, third true no upload " +rangeCheck );
                //                                     }
                //                                     else{
                                                    
                //                                         console.log("First false,second true, third false go upload " +rangeCheck );
                //                                     }
                                                    
                //                                 }
                //                             }
                //                         }   
                //                     }
                                    
                                    
                //                 }); 
                //                         if (rangeCheck) {



                //                                 exports.accountType.findOneAndUpdate(
                //                                     {  _id: accountGrouptypeID },
                //                                     { $set: { "accountGroup.$[outer]": accountGroupValues } },
                //                                     { "arrayFilters": [{"outer._id": accountGroupID}]},function(err,done) {
                //                                         return callback("1");
                //                                     });

                                               

                //                         } else {
                                                
                //                                 return callback("01");

                //                         }                
                //             }); 

                // }

        // });


    //if account type is same
    // exports.accountType.findOne({_id:accountGrouptypeID,"accountGroup._id":accountGroupID},function(err,foundAccount) {
       
    //     if(foundAccount){

            
    //     }

    // });

           

          



           
        
        // List.find({_id:"60cf2bc4461ed3487c041a2b","items.name":"Hit the + button to add a new item."},{_id:1, "items.$":1},function(err,response) {
        //     console.log("a" + response);
      
        //  });
        
        // if(allFoundResult._id==accountGrouptypeID){
        //     exports.accountType.findOneAndUpdate(
        //                 {"_id":accountGrouptypeID,"accountGroup._id":accountGroupID},
        //                 {$set: accountGroupValues}
        //                 , function(err,result) {
        //                 if(!err) {
        //                 //   res.redirect("/" + listName);
        //                 console.log("yes");
        //                 }
        //             });
            
        // } else{

        // }
        // allFoundResult.accountGroup.forEach(function(accounts) {
            
        // });


      

        
       
        // if (accountTypeRes) {
        //     return callback("0");
        // } else {
        //     let theID = accountType._id; 
        //     exports.accountType.updateOne(
        //         {_id:theID},
        //         {$set:{accountType:accountType.accountType}},
        //         function(err) {
        //             if(err){
        //                 return callback(err);
        //                 console.log(err);
        //             } else {
        //                 return callback("1");
        //                 console.log("okay");
        //             }
        //         });
        // }
   

////////////////////////////////////////////////////////////////////------update end--------/////////////
}
