//jshint esversion:6

const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    fullname:String,
    position:String,
    companyCode:[String]
});

userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model("User",userSchema);

passport.use(exports.User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });


exports.getUser = async function () {
    const userList = await exports.User.find({},'_id username fullname position companyCode');
    return userList;
}

exports.updateUser = async function (toUpdateUser,callback) {
    if (toUpdateUser.password=="retain") {
        exports.User.updateOne(
            {_id:toUpdateUser.id},
            {$set:toUpdateUser.userValues},
            function(err) {
                if(err){
                    return callback(err);
                } else {
                    return callback("1");
                }
            });

    } else {
        exports.User.updateOne(
            {_id:toUpdateUser.id},
            {$set:toUpdateUser.userValues},
            async function(err) {
                if(err){
                    return callback(err);
                } else {

                    exports.User.findById(toUpdateUser.id,function(err, foundUser) {
                        if(!err) {
                            foundUser.setPassword(toUpdateUser.password, function(){
                                foundUser.save(function(error) {
                                    if(!error){
                                        return callback("1");
                                    }
                                });
                            });
                        }
                    });
                }
            });
    }
}