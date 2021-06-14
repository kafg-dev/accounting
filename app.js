//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _lodash =require("lodash");
const ejs = require("ejs");
const country = require("country-list-js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/accountingDB",{useNewUrlParser:true,useUnifiedTopology: true})

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

let comCode = require(__dirname + "/exports/companycode.js");

let country_names = country.names();

app.get("/", function(req,res) {
    res.render('index');
});

app.get("/md-gl", function(req,res) {
    comCode.getCompanyCode(function(result){
        res.render('md-gl',{companyCodes:result});
      });
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
  
