//jshint esversion:6
const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _lodash =require("lodash");
const ejs = require("ejs");
const country= require("country-list");
const currency = require("currency-codes");
const flash = require('connect-flash');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const companyCode = require(__dirname + "/models/companycode.js");
const accType = require(__dirname + "/models/gl-accounttype.js");
// const accGroup = require(__dirname + "/models/gl-accountgroup.js");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"))
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

mongoose.connect("mongodb://localhost:27017/accountingDB",{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false})
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    fullname:String,
    position:String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });


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

app.get("/register", function(req,res) {
    if(req.isAuthenticated()) {
        res.render("register");
    } else {
        returnTo = req.url;
        res.redirect("/login");
    } 
});

app.get("/login", function(req,res) {
    const errors = req.flash().error || [];
    res.render("login", {errors});

});

app.post("/register", function(req,res) {
    User.register({username:req.body.username},req.body.password, function(err,user) {
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res, function() {
                user.fullname = req.body.fullname;
                user.position = req.body.position;
                user.save(function() {
                    res.redirect("/");
                }); 
            });
        }
    });
});

app.post("/login", function(req,res) {
    
    const user = new User ({
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
    req.logout();
    res.redirect("/");
});

/////////////////////////   user-defined values   ///////////////////////

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

/* companycode */

app.route("/gn-companycode")

.get(function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            companyCode.getCompanyCode(function(result) {
                res.render("companycode", {countries:country_names,currencies:currency_list,comcodes:result,user:req.user});
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

    let newCodeID = req.body.company_codeID;
    let newCode = req.body.company_code;
    let newCountry = req.body.company_country; 
    let newCurrency = req.body.company_currency;

     const newCompanyCode = new companyCode.cCode ({
        code:newCode,
        country:newCountry,
        currency:newCurrency
    });
    
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            companyCode.addCompanyCode(newCompanyCode, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = "http://localhost:3000/gn-companycode";
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
    let updateCountry = req.body.company_country; 
    let updateCurrency = req.body.company_currency;
    // res.json({mess: req.body.company_code});
    
    // res.send(req.body.company_code);
    const newUpdateCompanyCode = new companyCode.cCode ({
        _id:updateCodeID,
        code:updateCode,
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
                    servResp.redirectURL = "http://localhost:3000/gn-companycode";
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
                    servResp.redirectURL = "http://localhost:3000/gn-companycode";
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

/* account type */

app.route("/gl-accounttype")

.get(function(req,res) {
    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
           accType.getAccountType(function(result) {
                res.render("accounttype", {accountTypes:result,user:req.user});
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

    // const item = {
    //     accountGroup:"current assets",
    //     rangeFrom:20,
    //     rangeTo:5
    // };

    // const item2 = new accGroup.accountGroup({
    //     accountGroup:"current liabilities",
    //     rangeFrom:500,
    //     rangeTo:50
    // });

    const newAccountType = new accType.accountType ({
        accountType:req.body.account_type,
        accountGroup:[]
    });


    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.addAccountType(newAccountType, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = "http://localhost:3000/gl-accounttype";
                    servResp.message = "Account Type created!";
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


.patch(function(req,res) {

    let updateAccountTypeID = req.body. account_typeID;
    let updateAccountType = req.body. account_type;

    const newUpdateAccountType = {
        _id:updateAccountTypeID,
        accountType:updateAccountType
    };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.updateAccountType(newUpdateAccountType, function(callback){
                var servResp = {};
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = "http://localhost:3000/gl-accounttype";
                    servResp.message = "Account Type updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Type exists!";
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
                    servResp.redirectURL = "http://localhost:3000/gl-accounttype";
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
    let accountGroupRangeFrom = req.body.accountGroupRangeFrom;
    let accountGroupRangeTo = req.body.accountGroupRangeTo;

    const newAccountGroup = {
        accountTypeID:accountGrouptypeID,
        accountGroupValues: {
            accountGroup: accountGroupName,
            rangeFrom: accountGroupRangeFrom,
            rangeTo:accountGroupRangeTo
        }
    };

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.addAccountGroup(newAccountGroup, function(callback){
                var servResp = {};
                // console.log(callback);
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = "http://localhost:3000/gl-accountgroup";
                    servResp.message = "Account Group created!";
                    res.send(servResp);  
                }
                else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Group Exists!";
                    res.send(servResp);
                }
                else if (callback=="01"){
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
    var accountGroupID= req.body.accountGroupID;
    var accountGrouptypeID = req.body.accountGrouptypeID;
    var accountGroupName = req.body.accountGroupName;
    var accountGroupRangeFrom = req.body.accountGroupRangeFrom;
    var accountGroupRangeTo = req.body.accountGroupRangeTo;

    const toUpdateAccountGroup = {
        accountGrouptypeID : req.body.accountGrouptypeID,
        accountGroupID:req.body.accountGroupID,
        accountGroupValues : {
            accountGroup: req.body.accountGroupName,
            rangeFrom: req.body.accountGroupRangeFrom,
            rangeTo:req.body.accountGroupRangeTo
        }
    }

    if(req.isAuthenticated()) {
        if (req.user.position === "admin")
        {
            accType.updateAccountGroup(toUpdateAccountGroup, function(callback){
                var servResp = {};
                console.log(callback);
                if (callback=="1"){
                    servResp.redirect = true;
                    servResp.redirectURL = "http://localhost:3000/gl-accountgroup";
                    servResp.message = "Account Group updated!";
                    res.send(servResp);  
                } else if (callback=="0"){
                    servResp.redirect = false;
                    servResp.message = "Account Group Exists!";
                    res.send(servResp);
                }
                else if (callback=="01"){
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

.delete();

/////////////////////////    main pages   ///////////////////////

app.get("/md-gl", function(req,res) {
    // comCode.getCompanyCode(function(result){
    //     res.render('md-gl',{companyCodes:result});
    //   });
    console.log();
});

app.get("/md-vendor", function(req,res) {
    res.render('md-vendor',{countries:country_names});
   
});

app.get("/md-customer", function(req,res) {
    res.render('md-customer',{countries:country_names});
   
}); 

app.get("/md-taxrate", function(req,res) {
    res.render('md-gl');
   
});

app.get("/ac-gl", function(req,res) {
    res.render('md-gl');
   
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  
