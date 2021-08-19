//jshint esversion:6
const dotenv = require('dotenv').config();
const compression = require('compression');
const express = require("express");
const bodyParser = require("body-parser");
const _lodash =require("lodash");
const ejs = require("ejs");
const country= require("country-list");
const currency = require("currency-codes");
const cache = require("apicache").middleware;

//models
const usersDB =require(__dirname + "/models/users.js");
const companyCode = require(__dirname + "/models/companycode.js");
const accType = require(__dirname + "/models/gl-accounttype.js");
const glAcc = require(__dirname + "/models/glAccount.js");
const vendor = require(__dirname + "/models/vendor.js");
const customer = require(__dirname + "/models/customer.js");
const glSeries = require(__dirname + "/models/gl-series.js");
const glTransaction = require(__dirname + "/models/glTransaction.js");
const docSequence = require(__dirname + "/models/documentSequence.js");
const userPrivilege =require(__dirname + "/models/privilege.js");
const controlPeriod = require(__dirname + "/models/control.js");

const flash = require('connect-flash');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.set('view engine', 'ejs');

//Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(compression());


// mongoose.connect("mongodb://localhost:27017/accountingDB",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false,autoIndex: true})
mongoose.connect(process.env.DATABASE_URI,{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false,autoIndex: true})
mongoose.set("useCreateIndex",true);
mongoose.set('runValidators', true)



let returnTo = "";
let country_names = country.getNames();
let currency_list = currency.codes();

app.get('/ajax', function(req, res){
    res.render('ajax', {title: 'An Ajax Example', quote: "AJAX is great!"});
});

app.post('/ajax', function(req, res){
    res.render('ajax', {title: 'An Ajax Example', quote: req.body.quote});
});

//////////////////////////   flash     ///////////////////////////////
app.get('/flash', function(req, res){
    req.flash('info', 'Hi there!')
    res.redirect('/');
  });


/////////////////////////    index    ///////////////////////

app.get("/", function(req,res) {
    if(req.isAuthenticated()) {
        res.render("index",{user:req.user});
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
    
});

/////////////////////////   authentication    ///////////////////////
app.get("/login", function(req,res) {
    const errors = req.flash().error || [];
    res.render("login", {errors});
});

app.post("/login", function(req,res) {
    
    const user = new usersDB.User ({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,function(err) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local", {
                failureRedirect: '/login',
                failureFlash: true  
            }) (req,res,function() {
                res.redirect(returnTo || '/');
                returnTo = "";
            });
        }
    });
});

app.get("/logout", function(req,res) {
    res.setHeader("Cache-control","no-store");
    req.logout();
    res.redirect("/");
});

/////////////////////////   user-defined values   ///////////////////////
app.get('/db',async function(req,res){
    companyCode_list= await companyCode.getCompanyCode();
    res.send(companyCode_list);
});


/* dashboard */

app.route("/ud-dashboard")

.get(function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            res.render("ud-dashboard");

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
}).post().delete();

/* create user */
app.route("/us-create")

.get(async function (req,res) {

    if(req.isAuthenticated()) {
        if (req.user.position === "admin") {
            user_List= await usersDB.getUser();
            privilege_List= await userPrivilege.getPrivilege();
            companyCode_list= await companyCode.getCompanyCode();
            res.render("user", {companyCodes:companyCode_list,privilegeList:privilege_List,userList:user_List,user:req.user});
        } else {
            res.send("Unauthorized!");
        }
    }else {
        returnTo = req.url;
        res.redirect("/login");
    } 
   
})
.post(function (req,res) {
  

    if(req.isAuthenticated()) {
      if (req.user.position === "admin") {
         usersDB.User.register({username:req.body.username},req.body.password, function(err,user) {
                if(err){
                    console.log(err);
                    res.redirect("/us-create");
                } else {
                        user.fullname = req.body.fullname;
                        user.position = req.body.position;
                        user.companyCode = req.body.companyCode;
                        user.save(function(err) {
                            var servResp = {};
                            if(err) {
                                servResp.redirect = false;
                                servResp.errorMessage = err;
                                res.send(servResp); 
                            } else {
                                servResp.redirect = true;
                                servResp.redirectURL = process.env.BASE_URL + "/us-create";
                                servResp.message = "User created!";
                                res.send(servResp);  
                            }
                        }); 
                }
            });
      } else {
        res.send("Unauthorized!");
    }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
   

})
.patch(function (req,res) {
    
    const toUpdateUser = {
        id:req.body.userId,
        password:req.body.password,
        userValues:{
            fullname:req.body.fullname,
            position:req.body.position,
            companyCode:req.body.companyCode
            }
        }


    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            usersDB.updateUser(toUpdateUser, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/us-create";
                    servResp.message = "User updated!";
                    res.send(servResp);  
                } 
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }



}).delete();

/* user privileges */

app.route("/us-privilege")

.get(async function (req,res) {

    if(req.isAuthenticated()) {
        if (req.user.position === "admin") {
            let privilege_List= await userPrivilege.getPrivilege();
            res.render("privileges", {privilegeList:privilege_List,user:req.user});
        } else {
            res.send("Unauthorized!");
        }
    }else {
        returnTo = req.url;
        res.redirect("/login");
    } 

})

.post(function (req,res){
    const newPrivilege = new userPrivilege.privilege ({
        position:req.body.position,
        park:req.body.park,
        post:req.body.post
    });

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            userPrivilege.addPrivilege(newPrivilege, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/us-privilege";
                    servResp.message = "Position Privilege created!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.errorMessage = "Duplication error!";
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }


}).patch(function (req,res) {

    const toUpdatePrivilege = {
        id : req.body.positionID,
        privilegeValues :{
            position:req.body.position,
            park:req.body.park,
            post:req.body.post
        }
    }

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            userPrivilege.updatePrivilege(toUpdatePrivilege, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/us-privilege";
                    servResp.message = "Position Privilege updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.errorMessage = "Duplication Error!";
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }
}).delete();


/* companycode */

app.route("/gn-companycode")

.get(async function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            let companyCode_list= await companyCode.getCompanyCode();
            res.render("companycode", {countries:country_names,currencies:currency_list,companyCodes:companyCode_list,user:req.user});
        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})

.post(function(req,res) {

    let newCodeID = req.body.company_codeID;
    let newCode = req.body.company_code;
    let newName = req.body.company_name;
    let newCountry = req.body.company_country; 
    let newCurrency = req.body.company_currency;

     const newCompanyCode = new companyCode.cCode ({
        code:newCode,
        country:newCountry,
        company:newName,
        currency:newCurrency
    });
    
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            companyCode.addCompanyCode(newCompanyCode, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gn-companycode";
                    servResp.message = "Company Code created!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }
})

.put()

.patch(function(req,res) {

    let updateCodeID = req.body.company_codeID;
    let updateCode = req.body.company_code;
    let updateName = req.body.company_name;
    let updateCountry = req.body.company_country; 
    let updateCurrency = req.body.company_currency;
    // res.json({mess: req.body.company_code});
    
    // res.send(req.body.company_code);
    const newUpdateCompanyCode = new companyCode.cCode ({
        _id:updateCodeID,
        code:updateCode,
        company:updateName,
        country:updateCountry,
        currency:updateCurrency
    });
    
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            companyCode.updateCompanyCode(newUpdateCompanyCode, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gn-companycode";
                    servResp.message = "Company Code updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Company Code exists!";
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    
})

.delete(function(req,res) {
    
    let toDeleteCodeID = req.body.company_codeID;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            companyCode.deleteCompanyCode(toDeleteCodeID, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gn-companycode";
                    servResp.message = "Company Code deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    

});

/* control on closing and opening */

app.route("/gn-control")

.get(async function (req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            controlPeriod_List = await controlPeriod.getControlPeriod();
            companyCode_list= await companyCode.getCompanyCode();
            res.render("control", {controlPeriods:controlPeriod_List,companyCodes:companyCode_list,user:req.user});
        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})
.post(function (req,res) {

    const newControlPeriod = new controlPeriod.controlPeriod({
        accountType:req.body.accountType,
        companyCode:req.body.companyCode,
        fromAccount:req.body.fromAccount,
        toAccount:req.body.toAccount,
        fromPeriod:req.body.fromPeriod,
        toPeriod:req.body.toPeriod,
        controlYear:req.body.controlYear,
        status:req.body.status
    })

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            controlPeriod.addControlPeriod(newControlPeriod, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gn-control";
                    servResp.message = "Control created!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }



}).patch(function (req,res) {
    const toUpdatePeriod = {
        periodId : req.body.periodID,
        periodValues : {
            accountType:req.body.accountType,
            companyCode:req.body.companyCode,
            fromAccount:req.body.fromAccount,
            toAccount:req.body.toAccount,
            fromPeriod:req.body.fromPeriod,
            toPeriod:req.body.toPeriod,
            controlYear:req.body.controlYear,
            status:req.body.status
        }
    }

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            controlPeriod.updateControlPeriod(toUpdatePeriod, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gn-control";
                    servResp.message = "Control updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Control already exist!";
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    

})
.delete(function (req,res) {

    const toDeletePeriod = req.body.periodID;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            controlPeriod.deleteControlPeriod(toDeletePeriod, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gn-control";
                    servResp.message = "Control deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    


});

/* account type */

app.route("/gl-accounttype")

.get(async function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            let accountType_list= await accType.getAccountType();   
            res.render("accounttype", {accountTypes:accountType_list,user:req.user});

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})



.post(function(req,res) {

    const newAccountType = new accType.accountType ({
        accountType:req.body.account_type,
        rangeFrom:req.body.accountTypeRangeFrom,
        rangeTo:req.body.accountTypeRangeTo,
        accountGroup:[]
    });


    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.addAccountType(newAccountType, function(callback){
                var servResp = {};
                // console.log(callback);
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-accounttype";
                    servResp.message = "Account Type created!";
                    res.send(servResp);  
                }else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Type exists!";
                    res.send(servResp);
                }else if (callback=="01"){
                    servResp.redirect = false;
                    servResp.message = "Range already in use.";
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }
})


.patch(function(req,res) {

    let updateAccountTypeID = req.body.account_typeID;
    let updateAccountType = req.body.account_type;
    let rangeFrom = req.body.accountTypeRangeFrom;
    let rangeTo = req.body.accountTypeRangeTo;

    const newUpdateAccountType = {
        _id:updateAccountTypeID,
        accountTypeValues:{
            accountType:updateAccountType,
            rangeFrom:rangeFrom,
            rangeTo:rangeTo
        }
    };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.updateAccountType(newUpdateAccountType, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-accounttype";
                    servResp.message = "Account Type updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Type exists!";
                    res.send(servResp);
                }else if (callback=="01"){
                    servResp.redirect = false;
                    servResp.message = "Range already in use.";
                    res.send(servResp);
                }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }   
})

.delete(function(req,res) {
    let toDeleteAccountTypeID = req.body.account_typeID;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.deleteAccountType(toDeleteAccountTypeID, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-accounttype";
                    servResp.message = "Account Type deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    

});

/* account group */

app.route("/gl-accountgroup")

.get(function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
           accType.getAccountGroup(function(result) {
                res.render("accountgroup", {accounts:result,user:req.user});
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})

.post(function(req,res) {

    let accountGrouptypeID = req.body.accountGrouptypeID;
    let accountGroupName = req.body.accountGroupName;
    // let accountGroupRangeFrom = req.body.accountGroupRangeFrom;
    // let accountGroupRangeTo = req.body.accountGroupRangeTo;

    const newAccountGroup = {
        accountTypeID:accountGrouptypeID,
        accountGroup: accountGroupName,
        accountGroupValues: {
            accountGroup: accountGroupName
            // rangeFrom: accountGroupRangeFrom,
            // rangeTo:accountGroupRangeTo
        }
    };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.addAccountGroup(newAccountGroup, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-accountgroup";
                    servResp.message = "Account Group created!";
                    res.send(servResp);  
                }
                else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Group Exists!";
                    res.send(servResp);
                }
                
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }
})

.patch(function(req,res) {

    const toUpdateAccountGroup = {
        accountGrouptypeID : req.body.accountGrouptypeID,
        accountGroupID:req.body.accountGroupID,
        accountGroupValues : {
            accountGroup: req.body.accountGroupName
            // rangeFrom: req.body.accountGroupRangeFrom,
            // rangeTo:req.body.accountGroupRangeTo
        }
    }

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.updateAccountGroup(toUpdateAccountGroup, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-accountgroup";
                    servResp.message = "Account Group updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Group Exists!";
                    res.send(servResp);
                }
                // else if (callback=="01"){
                //     servResp.redirect = false;
                //     servResp.message = "Range already in use.";
                //     res.send(servResp);
                // }
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }   




})

.delete(function(req,res) {

    const toDeleteAccountGroup = {
        accountGrouptypeID : req.body.accountGrouptypeID,
        accountGroupID:req.body.accountGroupID
    }
    
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.deleteAccountGroup(toDeleteAccountGroup, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-accountgroup";
                    servResp.message = "Account Group deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    

});

/* gl series */

app.route("/gl-series")

.get(async function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            var glSeries_List = await glSeries.getGlSeries();
            res.render("gl-series", {glSeriesList:glSeries_List,user:req.user});

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})
.post(function(req,res){

    const newGlSeries = new glSeries.glSeries ({
        account:req.body.accountGl,
        series:req.body.seriesGl
    });

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            glSeries.addGlSeries(newGlSeries, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-series";
                    servResp.message = "GL Series created!";
                    res.send(servResp);  
                }
                else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Series already in use/Account series exists!";
                    res.send(servResp);
                }
                
                else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }


})
.patch(function (req,res){

    const toUpdateGlSeries = {
        account:req.body.accountGl,
        series:req.body.seriesGl
    }

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            glSeries.updateGlSeries(toUpdateGlSeries, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-series";
                    servResp.message = "GL Series updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Series already in use/Account series exists!";
                    res.send(servResp);
                }
                // // else if (callback=="01"){
                // //     servResp.redirect = false;
                // //     servResp.message = "Range already in use.";
                // //     res.send(servResp);
                // // }
                // else {
                //     servResp.redirect = false;
                //     servResp.error = true;
                //     servResp.errorMessage = callback;
                //     res.send(servResp);
                // }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }   

})

.delete(function(req,res) {

    const glSeries_id = req.body.glSeries_id;
    
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            glSeries.deleteGlSeries(glSeries_id, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-series";
                    servResp.message = "GL Series deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    
});

/* gl sequence */

app.route("/gl-sequence")

.get(async function (req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            var companyCode_list= await companyCode.getCompanyCode();
            var docSequence_List= await docSequence.getDocSequence();
            res.render("doc-seq", {docSequenceList:docSequence_List,companycodeList:companyCode_list,user:req.user});

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})

.post(function (req,res) {
    
    var docYear = req.body.year;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            docSequence.addDocSequence(docYear, function(callback) {
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/gl-sequence";
                    servResp.message = "Document Sequence generated!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Error!";
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 

}).delete();



/////////////////////////    main pages   //////////////////////
app.route("/main-list")

.get(async function(req,res) {
    // if(req.isAuthenticated()) {
        var main_list = {};
        main_list.companyCode_list= await companyCode.getCompanyCode(); 
        main_list.accountType_list= await accType.getAccountType(); 
        main_list.glAccount_list= await glAcc.getGlAccount(); 
        main_list.vendor_List = await vendor.getVendor();
        main_list.customer_List = await customer.getCustomer();
        main_list.glSeries_List = await glSeries.getGlSeries();
        main_list.glTransaction_List = await glTransaction.getGlTransaction();
        main_list.docSequence_List= await docSequence.getDocSequence();
        main_list.privilege_List= await userPrivilege.getPrivilege();
        main_list.controlPeriod_List = await controlPeriod.getControlPeriod();
        main_list.user_List= await usersDB.getUser();
        main_list.user=req.user;
        res.send(main_list);


    // }else {
    //     returnTo = req.url;
    //     res.redirect("/login");
    // }    

});

app.route("/md-gl")

.get(async function(req,res) {
   
    if(req.isAuthenticated()) {
 
        companyCode_list= await companyCode.getCompanyCode(); 
        accountType_list= await accType.getAccountType();  
        glAccount_list = await glAcc.getGlAccount();
        res.render('md-gl',{companyCodes:companyCode_list,user:req.user,accType:accountType_list,glAccounts:glAccount_list});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }    
   
 
})
.post(function(req,res) {

        const newGlAccount = new glAcc.glAccount ({
            glAccount:req.body.glAccount,
            glName: req.body.glName,
            companyCode:req.body.companyCode,
            accountCurrency:req.body.accountCurrency,
            accountType:req.body.accountType,
            taxCategory:req.body.taxCategory,
            accountGroup:req.body.accountGroup,
            descShort:req.body.descShort,
            descLong:req.body.descLong

        });

        if(req.isAuthenticated()) {
            if (req.user.position === "admin")
            {
                glAcc.addGlAccount(newGlAccount, function(callback) {
                    var servResp = {};
                    console.log(callback);
                    if (callback=="1"){
                        servResp.redirect = true;
                        servResp.redirectURL = process.env.BASE_URL + "/md-gl";
                        servResp.message = "GL Account Created!";
                        res.send(servResp);  
                    } else {
                        servResp.redirect = false;
                        servResp.error = true;
                        servResp.errorMessage = "GL Account Exists!";
                        res.send(servResp);
                    }
                });
    
            } else {
                res.send("Unauthorized!");
            }
        } else {
            returnTo = req.url;
            res.redirect("/login");
        } 




})

.patch(function(req,res) {

    const toUpdateGlAccount = {
        glAccount:req.body.glAccount,
        glAccountValues :{
            glName: req.body.glName,
            companyCode:req.body.companyCode,
            accountCurrency:req.body.accountCurrency,
            accountType:req.body.accountType,
            taxCategory:req.body.taxCategory,
            accountGroup:req.body.accountGroup,
            descShort:req.body.descShort,
            descLong:req.body.descLong
        }   
    };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            glAcc.updateGlAccount(toUpdateGlAccount, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-gl";
                    servResp.message = "GL Account updated!";
                    res.send(servResp);  
                }else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
        
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }   
})

.delete(function(req,res) {
    const toDeleteGlAccount = req.body.glAccount;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            glAcc.deleteGlAccount(toDeleteGlAccount, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-gl";
                    servResp.message = "GL Account deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    

});


app.route("/md-vendor")

.get(async function(req,res) {

    if(req.isAuthenticated()) {
 
        companyCode_list= await companyCode.getCompanyCode(); 
        accountType_list= await accType.getAccountType();  
        vendor_list = await vendor.getVendor();
        res.render('md-vendor',{vendors:vendor_list,countries:country_names,currencies:currency_list,companyCodes:companyCode_list,user:req.user});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }    
   
})

.post(function(req,res) {

    const newVendor = new vendor.vendor ({
       vendorCode: req.body.vendorCode,
       vendorName: req.body.vendorName,
       vendorCompanyCode: req.body.vendorCompanyCode,
       vendorCurrency: req.body.vendorCurrency,
       vendorTaxCategory: req.body.vendorTaxCategory,
       vendorPaymentTerm: req.body.vendorPaymentTerm,
       vendorTax: req.body.vendorTax,
       vendorRecon: req.body.vendorRecon,
       vendorStreet: req.body.vendorStreet,
       vendorCity: req.body.vendorCity,
       vendorCountry: req.body.vendorCountry,
       vendorPostalCode: req.body.vendorPostalCode,
       vendorTelephone: req.body.vendorTelephone,
       vendorEmail: req.body.vendorEmail,
       vendorWebsite: req.body.vendorWebsite
    });

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            vendor.addVendor(newVendor, function(callback) {
                var servResp = {};
                console.log(callback);
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-vendor";
                    servResp.message = "Vendor Created!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Vendor Code Exists!";
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 


})
.patch(function(req,res) {

    const toUpdateVendor = {
        vendorCode: req.body.vendorCode,
        vendorValues:{
            vendorName: req.body.vendorName,
            vendorCompanyCode: req.body.vendorCompanyCode,
            vendorCurrency: req.body.vendorCurrency,
            vendorTaxCategory: req.body.vendorTaxCategory,
            vendorPaymentTerm: req.body.vendorPaymentTerm,
            vendorTax: req.body.vendorTax,
            vendorRecon: req.body.vendorRecon,
            vendorStreet: req.body.vendorStreet,
            vendorCity: req.body.vendorCity,
            vendorCountry: req.body.vendorCountry,
            vendorPostalCode: req.body.vendorPostalCode,
            vendorTelephone: req.body.vendorTelephone,
            vendorEmail: req.body.vendorEmail,
            vendorWebsite: req.body.vendorWebsite
        }
       
     };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            vendor.updateVendor(toUpdateVendor, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-vendor";
                    servResp.message = "Vendor updated!";
                    res.send(servResp);  
                }else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
        
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }   
})

.delete(function(req,res) {
    const toDeleteVendor = req.body.vendorCode;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            vendor.deleteVendor(toDeleteVendor, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-vendor";
                    servResp.message = "Vendor deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    
});

app.route("/md-customer").

get(async function(req,res){

    if(req.isAuthenticated()) {
 
        companyCode_list= await companyCode.getCompanyCode(); 
        customer_list= await customer.getCustomer(); 
        res.render('md-customer',{countries:country_names,currencies:currency_list,companyCodes:companyCode_list,customers:customer_list,user:req.user});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }  
    
   

})

.post(function(req,res) {

    const newCustomer = new customer.customer({

        customerCode:req.body.customerCode,
        customerName:req.body.customerName,
        customerCompanyCode:req.body.customerCompanyCode, 
        customerCurrency :req.body.customerCurrency,
        customerTaxCategory :req.body.customerTaxCategory,
        customerPaymentTerm:req.body.customerPaymentTerm,
        customerTax :req.body.customerTax,
        customerRecon :req.body.customerRecon,
        customerStreet:req.body.customerStreet,
        customerCity:req.body.customerCity,
        customerCountry :req.body.customerCountry,
        customerPostalCode :req.body.customerPostalCode,
        customerTelephone :req.body.customerTelephone,
        customerEmail :req.body.customerEmail,
        customerWebsite :req.body.customerWebsite
       
    });
    
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            customer.addCustomer(newCustomer, function(callback) {
                var servResp = {}
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-customer";
                    servResp.message = "Customer Created!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Customer Code Exists!";
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 

}).patch(function(req,res){

    const toUpdateCustomer = {
    customerCode:req.body.customerCode,
     customerValues : {
        customerName:req.body.customerName,
        customerCompanyCode:req.body.customerCompanyCode, 
        customerCurrency :req.body.customerCurrency,
        customerTaxCategory :req.body.customerTaxCategory,
        customerPaymentTerm:req.body.customerPaymentTerm,
        customerTax :req.body.customerTax,
        customerRecon :req.body.customerRecon,
        customerStreet:req.body.customerStreet,
        customerCity:req.body.customerCity,
        customerCountry :req.body.customerCountry,
        customerPostalCode :req.body.customerPostalCode,
        customerTelephone :req.body.customerTelephone,
        customerEmail :req.body.customerEmail,
        customerWebsite :req.body.customerWebsite
     }
    };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            customer.updateCustomer(toUpdateCustomer, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-customer";
                    servResp.message = "Customer updated!";
                    res.send(servResp);  
                }else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
        
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }   



}).delete(function(req,res){

    const toDeleteCustomer = req.body.customerCode;

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            customer.deleteCustomer(toDeleteCustomer, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/md-customer";
                    servResp.message = "Customer deleted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = err;
                    res.send(servResp);
                }
            });

        } else {
            res.send("Unauthorized!");
        }
    } else {
        returnTo = req.url;
        res.redirect("/login");
    }    
});


app.get("/md-taxrate", function(req,res) {
    res.send("Under maintenance");
   
});

////// TRANSACTIONS

app.route("/ac-gl")

.get(async function(req,res) {
    res.setHeader("Cache-control","private, max-age=60");
    if(req.isAuthenticated()) {
        companyCode_list= await companyCode.getCompanyCode(); 
        glAccount_list = await glAcc.getGlAccount();
        customer_list = await customer.getCustomer();
        res.render('ac-gl',{user:req.user,companyCodes:companyCode_list,glAccounts:glAccount_list,customers:customer_list});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }  
    
  
})
.post(async function (req,res) {

    const docValues = {
        account:req.body.account,
        companyCode:req.body.companyCode,
        docYear:2021
    };

    const docNum = await docSequence.getDocNumber(docValues);
    
    const newGlTransaction = new glTransaction.glTransaction({
        documentNumber : docNum,
        documentDate : req.body.documentDate,
        postingDate : req.body.postingDate,
        reference :req.body.reference ,
        amount :req.body.amount ,
        text :req.body.text,
        companyCode :req.body.companyCode ,
        companyName :req.body.companyName,
        currency : req.body.currency,
        debit : req.body.debit, 
        credit : req.body.credit,
        transactionType:req.body.transactionType,
        status: "parked",
        parker:req.user._id,
        poster:"",
        jEntry:req.body.jlEntry
        
    });
    
    if(req.isAuthenticated()) {
      
            glTransaction.addGLTransaction(newGlTransaction, function(callback) {
                var servResp = {}
                if (callback.status=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/ac-gl";
                    servResp.message = "Document Number: " +callback.docNumber+ " saved!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Error!";
                    res.send(servResp);
                }
            });

    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 


}).patch().delete();

app.route("/ar-ci")

.get(async function(req,res) {
    res.setHeader("Cache-control","private");
    if(req.isAuthenticated()) {
        companyCode_list= await companyCode.getCompanyCode(); 
        glAccount_list = await glAcc.getGlAccount();
        res.render('ar-ci',{user:req.user,companyCodes:companyCode_list,glAccounts:glAccount_list});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }  


}).post(async function(req,res) {
    const docValues = {
        account:req.body.account,
        companyCode:req.body.companyCode,
        docYear:2021
    };

    const docNum = await docSequence.getDocNumber(docValues);
    
    const newGlTransaction = new glTransaction.glTransaction({
        documentNumber : docNum,
        documentDate : req.body.documentDate,
        postingDate : req.body.postingDate,
        reference :req.body.reference ,
        amount :req.body.amount ,
        text :req.body.text,
        companyCode :req.body.companyCode ,
        companyName :req.body.companyName,
        currency : req.body.currency,
        debit : req.body.debit, 
        credit : req.body.credit,
        transactionType:req.body.transactionType,
        status: "parked",
        parker:req.user._id,
        poster:"",
        jEntry:req.body.jlEntry
        
    });
    
    if(req.isAuthenticated()) {
      
            glTransaction.addGLTransaction(newGlTransaction, function(callback) {
                var servResp = {}
                if (callback.status=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/ar-ci";
                    servResp.message = "Document Number: " +callback.docNumber+ " saved!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Error!";
                    res.send(servResp);
                }
            });
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 

}).patch().delete();

app.route("/ap-vi")

.get(async function(req,res) {
    res.setHeader("Cache-control","private");
    if(req.isAuthenticated()) {
        companyCode_list= await companyCode.getCompanyCode(); 
        glAccount_list = await glAcc.getGlAccount();
        res.render('ap-vi',{user:req.user,companyCodes:companyCode_list,glAccounts:glAccount_list});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }  
})

.post(async function (req,res) {
    const docValues = {
        account:req.body.account,
        companyCode:req.body.companyCode,
        docYear:2021
    };

    const docNum = await docSequence.getDocNumber(docValues);
    
    const newGlTransaction = new glTransaction.glTransaction({
        documentNumber : docNum,
        documentDate : req.body.documentDate,
        postingDate : req.body.postingDate,
        reference :req.body.reference ,
        amount :req.body.amount ,
        text :req.body.text,
        companyCode :req.body.companyCode ,
        companyName :req.body.companyName,
        currency : req.body.currency,
        debit : req.body.debit, 
        credit : req.body.credit,
        transactionType:req.body.transactionType,
        status: "parked",
        parker:req.user._id,
        poster:"",
        jEntry:req.body.jlEntry
        
    });
    
    if(req.isAuthenticated()) {
      
            glTransaction.addGLTransaction(newGlTransaction, function(callback) {
                var servResp = {}
                if (callback.status=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/ap-vi";
                    servResp.message = "Document Number: " +callback.docNumber+ " saved!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Error!";
                    res.send(servResp);
                }
            });

    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
}).patch().delete();

app.route("/rp-vd")

.get(async function (req,res) {
    if(req.isAuthenticated()) {
        companyCode_list= await companyCode.getCompanyCode(); 
        glAccount_list = await glAcc.getGlAccount();
        glTransaction_List = await glTransaction.getGlTransaction();
        vendor_List = await vendor.getVendor();
        customer_List = await customer.getCustomer();
        res.render('rp-vd',{user:req.user,companyCodes:companyCode_list,glAccounts:glAccount_list,transactionList:glTransaction_List,customers:customer_List,vendors:vendor_List});

    }else {
        returnTo = req.url;
        res.redirect("/login");
    }  
})

.post(function (req,res) {

    const toUpdateValues = {
        documentID : req.body.docID,
        documentValues: {
        documentDate : req.body.documentDate,
        postingDate : req.body.postingDate,
        reference :req.body.reference ,
        amount :req.body.amount ,
        text :req.body.text,
        companyCode :req.body.companyCode ,
        companyName :req.body.companyName,
        currency : req.body.currency,
        debit : req.body.debit, 
        credit : req.body.credit,
        transactionType:req.body.transactionType,
        status: "parked",
        parker:req.user._id,
        poster:"",
        jEntry:req.body.jlEntry
        }
        
    };

    if(req.isAuthenticated()) {
      
            glTransaction.updateGLTransaction(toUpdateValues, function(callback) {
                var servResp = {}
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/rp-vd";
                    servResp.message = "Transaction Updated!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = callback;
                    res.send(servResp);
                }
            });

    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
})

.patch(function (req,res) {

    const toUpdateValues = {
        documentID:req.body.documentID,
        documentValues: {
            poster:req.user._id,
            status:"posted"
        }
    }

    if(req.isAuthenticated()) {
      
            glTransaction.updateGLTransaction(toUpdateValues, function(callback) {
                var servResp = {}
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = process.env.BASE_URL + "/rp-vd";
                    servResp.message = "Transaction Posted!";
                    res.send(servResp);  
                } else {
                    servResp.redirect = false;
                    servResp.error = true;
                    servResp.errorMessage = "Error!";
                    res.send(servResp);
                }
            });

    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
    


})
.delete();

app.route("/rp-vr")

.get(async function(req,res) {
    if(req.isAuthenticated()) {
    glTransaction_List = await glTransaction.getGlTransaction();
    companyCode_list= await companyCode.getCompanyCode();
    vendor_List = await vendor.getVendor();
    customer_List = await customer.getCustomer();
    res.render('rp-vr',{user:req.user,glTransactions:glTransaction_List,companyCodes:companyCode_list,vendors:vendor_List,customers:customer_List});
    }
    else {
        returnTo = req.url;
        res.redirect("/login");
    } 

}).post();

app.route("/rp-md")

.get(async function(req,res) {
    if(req.isAuthenticated()) {
    glTransaction_List = await glTransaction.getGlTransaction();
    companyCode_list= await companyCode.getCompanyCode();
    vendor_List = await vendor.getVendor();
    customer_List = await customer.getCustomer();
    res.render('rp-md',{user:req.user,glTransactions:glTransaction_List,companyCodes:companyCode_list,vendors:vendor_List,customers:customer_List});
    }
    else {
        returnTo = req.url;
        res.redirect("/login");
    } 

}).post();

app.route("/down")
.get(function(req,res){
    res.render('down',{user:req.user});
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  
