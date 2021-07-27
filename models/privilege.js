//jshint esversion:6

const mongoose = require ("mongoose");

const privilegeSchema = new mongoose.Schema({
    position:{
        type:String,
        index:{unique:true,sparse:true}
    },
    park:Number,
    post:Number
});

exports.privilege = mongoose.model("privilege",privilegeSchema);

exports.getPrivilege = async function () {
    const privilegeList = await exports.privilege.find({});
    return privilegeList;
}

exports.addPrivilege = function (newPrivilege,callback) {

    newPrivilege.save(function(err){
        if (err) {
            return callback("0");
        } else {
            return callback("1");
        }
    })
}


exports.updatePrivilege = function (toUpdatePrivilege,callback) {

    exports.privilege.updateOne(
        {_id:toUpdatePrivilege.id},
        {$set:toUpdatePrivilege.privilegeValues},
        function(err) {
            if(err){
                return callback(err);
            } else {
                return callback("1");
            }
        });
}

