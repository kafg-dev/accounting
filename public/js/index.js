$(document).ready(function() {
  //////tables
  $("#companyCodeTable").DataTable();
  $("#accountTypeTable").DataTable();
  $("#accountGroupTable").DataTable();
  $("#glSeriesTable").DataTable();
  $("#usersTable").DataTable();
  $("#privTable").DataTable();
  $("#periodTable").DataTable();

  ///// ALERTS
  function showLabel(alertId, message,alertType){
    var id = "#" + alertId;
    $(id).addClass(alertType).removeClass("d-none");
    $(id).fadeIn();
    $(id).text(message);
   
    window.setTimeout(function() {
      $(id).fadeOut("slow", "swing");
      $(id).addClass("d-none").removeClass(alertType).text("");  }, 2000);
  }

  ///// show hidden textBox
  function showDiv(divID,formID){
    $("#"+formID+" #"+divID).removeClass("d-none");
  }

  ///// hide textBox
  function hideDiv(divID){
    $(divID).addClass("d-none");
  }
  //////validate form
  function validateForm(formID)
  {
    return $("#"+formID).validate();
  }

  ///// clear form
  function clearForm(formID)
  {
    $('#'+formID)[0].reset();
  }

  /////////users --------------------------------------------------------

   //////// table on click
   $("#usersTable").on("click", "tr", function() {
    clearForm("users-create");
    showDiv("onSelectDiv","users-create");
    $("#users-create #userID").val($(this).find("td")[0].innerText);
    $("#users-create #userCompanyCode").val($(this).find("td")[1].innerText.split(","));
    $("#users-create #fullname").val($(this).find("td")[2].innerText); 
    $("#users-create #username").attr('readonly','readonly').val($(this).find("td")[3].innerText); 
    $("#users-create #position").val($(this).find("td")[4].innerText);

    
  });

  //// clear button
  $('#users-clearbtn').click(function(e){ 
    clearForm("users-create");
    $("#users-create #onSelectDiv").addClass("d-none");
    $('#users-create #username').removeAttr('readonly');
    
  });

  ////////////// create --------------------------------------------------------
  $('#users-addbtn').click(function(e){ 

    if(validateForm("users-create").form()){
         var fullname = $('#fullname').val();
         var position = $('#position').val();
         var username = $('#username').val();
         var password = $('#password').val();
         var companyCode = $('#userCompanyCode').val();
         var retypepassword = $('#retypepassword').val();
        
         if(password===retypepassword) {
            $.ajax({  
              type: "POST",
              url:'/us-create', 
              data: {username:username,fullname:fullname,position:position,password:password,companyCode:companyCode},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("users-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else if (response=="Unauthorized!") {
                    showLabel("users-label", "Unauthorized user!","alert-danger");
                } else {
                    showLabel("users-label", JSON.stringify(response.errorMessage),"alert-danger");
                }
              },  
                  error:function(response){  
                    console.log(response); 
                  }  
            });
         } else {
           showLabel("users-label", "Passwords does not match!","alert-danger");
         }
   
    } else {
    }
    
  });

  ////////////// update --------------------------------------------------------
  $('#users-updatebtn').click(function(e){ 

    if(validateForm("users-create").form()){
          var userId = $('#userID').val();
          var fullname = $('#fullname').val();
          var position = $('#position').val();
          var companyCode = $('#userCompanyCode').val();
          var username = $('#username').val();
          var password = $('#password').val();
          var retypepassword = $('#retypepassword').val();

          if (userId == "")
           {
            showLabel("users-label", "Error! Select a user from table.","alert-danger");
           }

          else {

            if(password==retypepassword) {
              $.ajax({  
                  type: "PATCH",
                  url:'/us-create', 
                  data: {userId:userId,fullname:fullname,position:position,username:username,password:password,companyCode:companyCode},
                  success:function(response){ 
                    
                  if(response.redirect) {
                      showLabel("users-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else if (response=="Unauthorized!") {
                      showLabel("users-label", "Unauthorized user!","alert-danger");
                  } else {
                      showLabel("users-label", JSON.stringify(response.errorMessage),"alert-danger");
                  }
                  },  
                  error:function(response){  
                    console.log(response); 
                  }  
                });  
            }

            else {
              showLabel("users-label", "Passwords does not match!","alert-danger");
            }
                
          }


    } else {

    }
          
});

/////////privileges --------------------------------------------------------

   //////// table on click
   $("#privTable").on("click", "tr", function() {
    clearForm("privileges-form");
    $("#privileges-form #positionID").val($(this).find("td")[0].innerText);
    $("#privileges-form #privPosition").val($(this).find("td")[1].innerText); 
      if($(this).find("td")[2].innerText=="Yes"){
        $("#privileges-form #parkPriv").prop("checked", true);
      } else {
        $("#privileges-form #parkPriv").prop("checked", false);
      }
      if($(this).find("td")[3].innerText=="Yes"){
        $("#privileges-form #postPriv").prop("checked", true);
      } else {
        $("#privileges-form #postPriv").prop("checked", false);
      }
  });

  //// clear button
  $('#priv-clearbtn').click(function(e){ 
    clearForm("privileges-form");
  });

  ////////////// create --------------------------------------------------------
  $('#priv-addbtn').click(function(e){ 

    if(validateForm("privileges-form").form()){
         var position = $('#privPosition').val().toLowerCase();
         var post = 0;
         var park = 0;

         if($('#postPriv').prop('checked')) {
           post = 1;

         }
         if($('#parkPriv').prop('checked')) {
           park = 1;
         }
        

            $.ajax({  
              type: "POST",
              url:'/us-privilege', 
              data: {position:position,post:post,park:park},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("privilege-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else if (response=="Unauthorized!") {
                    showLabel("privilege-label", "Unauthorized user!","alert-danger");
                } else {
                    showLabel("privilege-label", response.errorMessage,"alert-danger");
                }
              },  
                  error:function(response){  
                    console.log(response); 
                  }  
            });
   
    } else {
    }
    
  });

  ////////////// update --------------------------------------------------------
  $('#priv-updatebtn').click(function(e){ 

    if(validateForm("privileges-form").form()){
      var position = $('#privPosition').val().toLowerCase();
      var positionID = $('#positionID').val();
      var post = 0;
      var park = 0;

      if (positionID==""){
        showLabel("privilege-label", "Error! Select a position from table.","alert-danger");
      }

      else {
        if($('#postPriv').prop('checked')) {
          post = 1;
  
        }
        if($('#parkPriv').prop('checked')) {
          park = 1;
        }
       
           $.ajax({  
             type: "PATCH",
             url:'/us-privilege', 
             data: {positionID:positionID,position:position,post:post,park:park},
             success:function(response){ 
               
               if(response.redirect) {
                   showLabel("privilege-label",response.message,"alert-success");
                   window.setTimeout(function() {
                     window.location = response.redirectURL;}, 1000);
               
               } else if (response=="Unauthorized!") {
                   showLabel("privilege-label", "Unauthorized user!","alert-danger");
               } else {
                   showLabel("privilege-label", response.errorMessage,"alert-danger");
               }
             },  
                 error:function(response){  
                   console.log(response); 
                 }  
           });

      }
 } else {
 }
          
});


  /////////company code --------------------------------------------------------

 //////// table on click
  $("#companyCodeTable").on("click", "tr", function() {
    showDiv("onSelectDiv","ccode");
    $("#ccode #selectedCompanyCode").val($(this).find("td")[1].innerText); 
    $("#ccode #company_codeID").val($(this).find("td")[0].innerText);
    $("#ccode #company_code").val($(this).find("td")[1].innerText); 
    $("#ccode #company_name").val($(this).find("td")[2].innerText);
    $("#ccode #company_country").val($(this).find("td")[3].innerText); 
    $("#ccode #company_currency").val($(this).find("td")[4].innerText);
  });

  //// clear button
  $('#ccode-clearbtn').click(function(e){ 
    clearForm("ccode");
    hideDiv("#ccode #onSelectDiv");
  });

  ////////////// create --------------------------------------------------------
  $('#ccode-addbtn').click(function(e){ 

    if(validateForm("ccode").form()){
         var companyCodeID = $('#company_codeID').val();
         var companyCode = $('#company_code').val();
         var companyName = $('#company_name').val();
         var companyCountry = $('#company_country').val();
         var companyCurrency = $('#company_currency').val();

                $.ajax({  
                  type: "POST",
                  url:'/gn-companycode', 
                  data: {company_codeID:companyCodeID,company_code:companyCode,company_name:companyName,company_country:companyCountry,company_currency:companyCurrency},
                  success:function(response){ 
                    
                    if(response.redirect) {
                        showLabel("ccode-label",response.message,"alert-success");
                        window.setTimeout(function() {
                          window.location = response.redirectURL;}, 1000);
                    
                    } else {
                        if(response.error){
                          showLabel("ccode-label", response.errorMessage,"alert-danger");
                        }
                        else {
                          showLabel("ccode-label", "Company code exists!","alert-danger");
                        }
                    }
                  },  
                      error:function(response){  
                        console.log(response); 
                      }  
                });

    } else {
     
    
    }
    
  });

  ////////////// update --------------------------------------------------------
  $('#ccode-updatebtn').click(function(e){ 

    if(validateForm("ccode").form()){
      var companyCodeID = $('#company_codeID').val();
          var companyCode = $('#company_code').val();
          var companyName = $('#company_name').val();
          var companyCountry = $('#company_country').val();
          var companyCurrency = $('#company_currency').val();

          if (companyCodeID == "")
           {
            showLabel("ccode-label", "Error! Select company code from table.","alert-danger");
           }

          else {
                $.ajax({  
                  type: "PATCH",
                  url:'/gn-companycode', 
                  data: {company_codeID:companyCodeID,company_code:companyCode,company_name:companyName,company_country:companyCountry,company_currency:companyCurrency},
                  success:function(response){ 
                    
                    if(response.redirect) {
                        showLabel("ccode-label",response.message,"alert-success");
                        window.setTimeout(function() {
                          window.location = response.redirectURL;}, 1000);
                        
                    
                    } else {
                      if(response.error){
                        showLabel("ccode-label", "error " + response.errorMessage,"alert-danger");
                      } else {
                        showLabel("ccode-label", response.message,"alert-danger");
                      }
                  }
                  },  
                  error:function(response){  
                    console.log(response); 
                  }  
                });  
          }


    } else {

    }
          
});
  
 ////////////// delete --------------------------------------------------------
 $('#ccode-deletebtn').click(function(e){ 

  if(validateForm("ccode").form()){
    var companyCodeID = $('#company_codeID').val();

        if (companyCodeID == "")
           {
            showLabel("ccode-label", "Error! Select company code from table.","alert-danger");
           }

        else {
            $.ajax({  
              type: "DELETE",
              url:'/gn-companycode', 
              data: {company_codeID:companyCodeID},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("ccode-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else {
                  if(response.error){
                    showLabel("ccode-label", "error " + response.errorMessage,"alert-danger");
                  }
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  

          }
  }
        else{

        }

});

/////////control on opening and closing period --------------------------------------------------------

 //////// table on click
 $("#periodTable").on("click", "tr", function() {
  // showDiv("onSelectDiv","ccode");
  // $("#selectedCompanyCode").val($(this).find("td")[1].innerText); 
  $("#periodID").val($(this).find("td")[0].innerText);
  $("#period_accountType").val($(this).find("td")[1].innerText); 
  $("#period_companycode").val($(this).find("td")[3].innerText); 
  $("#period_fromAccount").val($(this).find("td")[4].innerText);
  $("#period_toAccount").val($(this).find("td")[5].innerText);
  $("#period_fromPeriod").val($(this).find("td")[6].innerText);
  $("#period_toPeriod").val($(this).find("td")[7].innerText);
  $("#period_year").val($(this).find("td")[8].innerText);
  $("#period_status").val($(this).find("td")[9].innerText);
});

//// clear button
$('#period-clearbtn').click(function(e){ 
  clearForm("controlPeriod");
});

////////////// create --------------------------------------------------------
$('#period-addbtn').click(function(e){ 

  if(validateForm("controlPeriod").form()){
       var accountType = $('#period_accountType').val();
       var companyCode = $('#period_companycode').val();
       var fromAccount = $('#period_fromAccount').val();
       var toAccount = $('#period_toAccount').val();
       var fromPeriod = $('#period_fromPeriod').val();
       var toPeriod = $('#period_toPeriod').val();
       var controlYear = $('#period_year').val();
       var status = $('#period_status').val();

              $.ajax({  
                type: "POST",
                url:'/gn-control', 
                data: {accountType:accountType,companyCode:companyCode,fromAccount:fromAccount,toAccount:toAccount,fromPeriod:fromPeriod,toPeriod:toPeriod,controlYear:controlYear,status:status},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("period-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else {
                      if(response.error){
                        showLabel("period-label", response.errorMessage,"alert-danger");
                      }
                      else {
                        showLabel("period-label", "Control exists!","alert-danger");
                      }
                  }
                },  
                    error:function(response){  
                      console.log(response); 
                    }  
              });

  } else {
   
  
  }
  
});

////////////// update --------------------------------------------------------
$('#period-updatebtn').click(function(e){ 

  if(validateForm("controlPeriod").form()){
        var periodID = $('#periodID').val();
        var accountType = $('#period_accountType').val();
        var companyCode = $('#period_companycode').val();
        var fromAccount = $('#period_fromAccount').val();
        var toAccount = $('#period_toAccount').val();
        var fromPeriod = $('#period_fromPeriod').val();
        var toPeriod = $('#period_toPeriod').val();
        var controlYear = $('#period_year').val();
        var status = $('#period_status').val();
      
        if (periodID == "")
         {
          showLabel("period-label", "Error! Select period from table.","alert-danger");
         }

        else {
              $.ajax({  
                type: "PATCH",
                url:'/gn-control', 
                data: {periodID:periodID,accountType:accountType,companyCode:companyCode,fromAccount:fromAccount,toAccount:toAccount,fromPeriod:fromPeriod,toPeriod:toPeriod,controlYear:controlYear,status:status},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("period-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else {
                    if(response.error){
                      showLabel("period-label", "error " + response.errorMessage,"alert-danger");
                    } else {
                      showLabel("period-label", response.message,"alert-danger");
                    }
                }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        }


  } else {

  }
        
});

////////////// delete --------------------------------------------------------
$('#period-deletebtn').click(function(e){ 

  if(validateForm("controlPeriod").form()){
    var periodID = $('#periodID').val();

    if (periodID == "")
    {
     showLabel("period-label", "Error! Select period from table.","alert-danger");
    }

        else {
            $.ajax({  
              type: "DELETE",
              url:'/gn-control', 
              data: {periodID:periodID},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("period-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else {
                  if(response.error){
                    showLabel("period-label", "error " + response.errorMessage,"alert-danger");
                  }
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  

          }
  }
        else{

        }

});

///////account type

 //////// table on click
 $("#accountTypeTable").on("click", "tr", function() {
  showDiv("onSelectDiv","acctype");
  $("#acctype #selectedAccountType").val($(this).find("td")[1].innerText); 
  $("#acctype #accountTypeID").val($(this).find("td")[0].innerText);
  $("#acctype #account_type").val($(this).find("td")[1].innerText); 
  $("#acctype #accountTypeRangeFrom").val($(this).find("td")[2].innerText);
  $("#acctype #accountTypeRangeTo").val($(this).find("td")[3].innerText);

});

 //// clear button
 $('#acctype-clearbtn').click(function(e){ 
  clearForm("acctype");
  hideDiv("#acctype #onSelectDiv");
});

//////// create
$('#acctype-addbtn').click(function(e){ 

  if(validateForm("acctype").form()){
          var account_type = $('#account_type').val();
          var accountTypeRangeFrom = $('#accountTypeRangeFrom').val();
          var accountTypeRangeTo = $('#accountTypeRangeTo').val();
              $.ajax({  
                type: "POST",
                url:'/gl-accounttype', 
                data: {account_type:account_type,accountTypeRangeFrom:accountTypeRangeFrom,accountTypeRangeTo:accountTypeRangeTo},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("acctype-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else {
                      if(response.error){
                        showLabel("acctype-label", response.errorMessage,"alert-danger");
                      }
                      else {
                        showLabel("acctype-label", response.message,"alert-danger");
                      }
                  }
                },  
                    error:function(response){  
                      console.log(response); 
                    }  
              });



  } else {
   
  
  }
  
});

////////////// update --------------------------------------------------------
$('#acctype-updatebtn').click(function(e){ 

  if(validateForm("acctype").form()){
        var account_type = $('#account_type').val();
        var account_typeID = $('#accountTypeID').val();
        var accountTypeRangeFrom = $('#accountTypeRangeFrom').val();
        var accountTypeRangeTo = $('#accountTypeRangeTo').val();

        if (account_typeID == "")
         {
          showLabel("acctype-label", "Error! Select account type from table.","alert-danger");
         }

        else {
              $.ajax({  
                type: "PATCH",
                url:'/gl-accounttype', 
                data: {account_typeID:account_typeID,account_type:account_type,accountTypeRangeFrom:accountTypeRangeFrom,accountTypeRangeTo:accountTypeRangeTo},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("acctype-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else {
                    if(response.error){
                      showLabel("acctype-label", "error " + response.errorMessage,"alert-danger");
                    }else {
                      showLabel("acctype-label", response.message,"alert-danger");
                    }
                }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        }


  } else {

  }
        
});

////////////// delete --------------------------------------------------------
$('#acctype-deletebtn').click(function(e){ 

  if(validateForm("acctype").form()){
    var account_typeID = $('#accountTypeID').val();

        if (account_typeID == "")
           {
            showLabel("acctype-label", "Error! Select company code from table.","alert-danger");
           }

        else {
            $.ajax({  
              type: "DELETE",
              url:'/gl-accounttype', 
              data: {account_typeID:account_typeID},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("acctype-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else {
                  if(response.error){
                    showLabel("acctype-label", "error " + response.errorMessage,"alert-danger");
                  }
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  

          }
  }
        else{

        }

});

///////account group

 //////// table on click
 $("#accountGroupTable").on("click", "tr", function() {
  showDiv("onSelectDiv","accgroup");
  $("#accgroup #selectedAccountGroup").val($(this).find("td")[1].innerText); 
  $("#accgroup #accountGroupID").val($(this).find("td")[0].innerText);
  $("#accgroup #accountGroupName").val($(this).find("td")[1].innerText); 
  $("#accgroup #accGroup_typeID").val($(this).find("td")[2].innerText); 

});

 //// clear button
 $('#accgroup-clearbtn').click(function(e){ 
  clearForm("accgroup");
  hideDiv("#accgroup #onSelectDiv");
});

//////// create
$('#accgroup-addbtn').click(function(e){ 

  if(validateForm("accgroup").form()){
          var accountGrouptypeID = $('#accGroup_typeID').val();
          var accountGroupName = $('#accountGroupName').val();
          // var accountGroupRangeFrom = $('#accountGroupRangeFrom').val();
          // var accountGroupRangeTo = $('#accountGroupRangeTo').val();

              $.ajax({  
                type: "POST",
                url:'/gl-accountgroup', 
                data: {accountGrouptypeID:accountGrouptypeID,accountGroupName:accountGroupName},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("accgroup-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else {
                      if(response.error){
                        showLabel("accgroup-label", response.errorMessage,"alert-danger");
                      }
                      else {
                        showLabel("accgroup-label", response.message,"alert-danger");
                      }
                  }
                },  
                    error:function(response){  
                      console.log(response); 
                    }  
              });



  } else {
   
  
  }
  
});

////////////// update --------------------------------------------------------
$('#accgroup-updatebtn').click(function(e){ 

  if(validateForm("accgroup").form()){
    var accountGroupID= $('#accountGroupID').val();
    var accountGrouptypeID = $('#accGroup_typeID').val();
    var accountGroupName = $('#accountGroupName').val();
    // var accountGroupRangeFrom = $('#accountGroupRangeFrom').val();
    // var accountGroupRangeTo = $('#accountGroupRangeTo').val();
        

        if (accountGroupID == "")
         {
          showLabel("accgroup-label", "Error! Select account type from table.","alert-danger");
         }

        else {
              $.ajax({  
                type: "PATCH",
                url:'/gl-accountgroup', 
                data: {accountGroupID:accountGroupID,accountGrouptypeID:accountGrouptypeID,accountGroupName:accountGroupName},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("accgroup-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                      
                  
                  } else {
                    if(response.error){
                      showLabel("accgroup-label", "error " + response.errorMessage,"alert-danger");
                    }else {
                      showLabel("accgroup-label", response.message,"alert-danger");
                    }
                }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        }


  } else {

  }
        
});

////////////// delete --------------------------------------------------------
$('#accgroup-deletebtn').click(function(e){ 

  if(validateForm("accgroup").form()){
    var accountGroupID= $('#accountGroupID').val();
    var accountGrouptypeID = $('#accGroup_typeID').val();

      if (accountGroupID == "")
      {
      showLabel("accgroup-label", "Error! Select account type from table.","alert-danger");
      }


        else {
            $.ajax({  
              type: "DELETE",
              url:'/gl-accountgroup', 
              data: {accountGroupID:accountGroupID,accountGrouptypeID:accountGrouptypeID},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("accgroup-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else {
                  if(response.error){
                    showLabel("accgroup-label", "error " + response.errorMessage,"alert-danger");
                  }
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  

          }
  }
        else{

        }

});

///////gl series

//  //////// table on click
 $("#glSeriesTable").on("click", "tr", function() {
  showDiv("onSelectDiv","glSeries");
  $("#glSeries #selectedGlSeries").val($(this).find("td")[1].innerText); 
  $("#glSeries #glSeries_id").val($(this).find("td")[0].innerText);
  $("#glSeries #accountGL").val($(this).find("td")[1].innerText); 
  $("#glSeries #seriesGL").val($(this).find("td")[2].innerText); 

});

 //// clear button
 $('#glSeries-clearbtn').click(function(e){ 
  clearForm("glSeries");
  hideDiv("#glSeries #onSelectDiv");
});

//////// create
$('#glSeries-addbtn').click(function(e){ 

  if(validateForm("glSeries").form()){
          var accountGl = $('#accountGL').val();
          var seriesGl = $('#seriesGL').val();

              $.ajax({  
                type: "POST",
                url:'/gl-series', 
                data: {accountGl:accountGl,seriesGl:seriesGl},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("glSeries-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else {
                      if(response.error){
                        showLabel("glSeries-label", response.errorMessage,"alert-danger");
                      }
                      else {
                        showLabel("glSeries-label", response.message,"alert-danger");
                      }
                  }
                },  
                    error:function(response){  
                      console.log(response); 
                    }  
              });

  } else {
   
  
  }
  
});

////////////// update --------------------------------------------------------
$('#glSeries-updatebtn').click(function(e){ 

  if(validateForm("glSeries").form()){
    var accountGl = $('#accountGL').val();
    var seriesGl = $('#seriesGL').val();
    var seriesGl_id = $('#glSeries_id').val();

        if (seriesGl_id == "")
         {
          showLabel("glSeries-label", "Error! Select account from table.","alert-danger");
         }

        else {
              $.ajax({  
                type: "PATCH",
                url:'/gl-series', 
                data: {accountGl:accountGl,seriesGl:seriesGl},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("glSeries-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                      
                  
                  } else {
                    if(response.error){
                      showLabel("glSeries-label", "error " + response.errorMessage,"alert-danger");
                    }else {
                      showLabel("glSeries-label", response.message,"alert-danger");
                    }
                }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        }


  } else {

  }
        
});


////////////// delete --------------------------------------------------------
$('#glSeries-deletebtn').click(function(e){ 

  if(validateForm("glSeries").form()){
    var glSeries_id= $('#glSeries_id').val();
    
      if (glSeries_id == "")
      {
      showLabel("glSeries-label", "Error! Select account from table.","alert-danger");
      }


        else {
            $.ajax({  
              type: "DELETE",
              url:'/gl-series', 
              data: {glSeries_id:glSeries_id},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("glSeries-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else {
                  if(response.error){
                    showLabel("glSeries-label", "error " + response.errorMessage,"alert-danger");
                  }
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  

          }
  }
        else{

        }

});


/////////////////////////////////////// main pages

////////////////////////////////////////////// GL -MASTER DATA

 $("#gl-create #acc_type").change(function(e) {
   var selectedAcc_type = $("#gl-create #acc_type").val(); 
 
   if (selectedAcc_type){
        $.ajax({  
          type: "GET",
          url:'/main-list', 
          data: {},
          success:function(response){ 
              var foundAccountType_list = response.accountType_list;
              $('#gl-create #acc_group').empty();
              $('#gl-create #acc_group').append('<option selected disabled> Choose... </option>');
              foundAccountType_list.forEach(function(foundAccountType){
                if(foundAccountType._id==selectedAcc_type){
                  foundAccountType.accountGroup.forEach(function(accountGroup) {
                    $('#gl-create #acc_group').append('<option value="' + accountGroup._id + '">' + accountGroup.accountGroup + '</option>');
                  })
                }
              });
          },  
          error:function(response){  
            console.log(response); 
          }  
        });  
   }
 });


//////// create
$('#gl-create-btn').click(function(e){ 

  if(validateForm("gl-create").form()){
        var glAccount =  $("#gl-create #gl_account").val(); 
        var companyCode = $("#gl-create #c_code").val();
        var accountType = $("#gl-create #acc_type").val();
        var accountGroup = $("#gl-create #acc_group").val();
        var glName = $("#gl-create #gl_name").val();
        var accountCurrency = $("#gl-create #acc_currency").val();
        var taxCategory = $("#gl-create #tax_category").val();
        var descShort = $("#gl-create #desc_short").val();
        var descLong = $("#gl-create #desc_long").val();
       
              $.ajax({  
                type: "POST",
                url:'/md-gl', 
                data: {glAccount:glAccount,companyCode:companyCode,accountType:accountType,accountGroup:accountGroup,glName:glName,accountCurrency:accountCurrency,taxCategory:taxCategory,descShort:descShort,descLong:descLong},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("gl-create-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                  } else if (response=="Unauthorized!") {
                        showLabel("gl-create-label", "Unauthorized user!","alert-danger");
                      }

                      else{
                        showLabel("gl-create-label", response.errorMessage,"alert-danger");
                      }
                      
                },  
                    error:function(response){  
                      console.log(response); 
                    }  
              });



  } else {
   
  
  }
  
});


//////// modify - on change

$("#gl-modify #gl_account").change(function(e) {
  var selectedGl_account = $("#gl-modify #gl_account").val(); 
 
  if (selectedGl_account){
       $.ajax({  
         type: "GET",
         url:'/main-list', 
         data: {},
         success:function(response){ 
             var foundGlAccount_list = response.glAccount_list;
             var companyCode_list= response.companyCode_list; 
             var accountType_list= response.accountType_list; 
             $('#gl-modify #acc_group').empty().append('<option selected disabled> Choose... </option>');
            foundGlAccount_list.forEach(function(foundGlAccount) {
              
              if(foundGlAccount._id==selectedGl_account) {
                $("#gl-modify #c_code").val(foundGlAccount.companyCode); 
                $("#gl-modify #acc_type").val(foundGlAccount.accountType);
                  accountType_list.forEach(function(accountType) {
                      if(foundGlAccount.accountType==accountType._id){
                        accountType.accountGroup.forEach(function(accountGroup) {
                          if(foundGlAccount.accountGroup==accountGroup._id){
                            $('#gl-modify #acc_group').append('<option value="' + accountGroup._id + '" selected>' + accountGroup.accountGroup + '</option>');
                          } else {
                            $('#gl-modify #acc_group').append('<option value="' + accountGroup._id + '">' + accountGroup.accountGroup + '</option>');
                          }
                        });
                      }
                  });
                $("#gl-modify #gl_name").val(foundGlAccount.glName);  
                $("#gl-modify #acc_currency").val(foundGlAccount.accountCurrency);
                $("#gl-modify #desc_short").val(foundGlAccount.descShort);
                $("#gl-modify #desc_long").val(foundGlAccount.descLong);
              }
            });
         },  
         error:function(response){  
           console.log(response); 
         }  
       });  
  }
});
///on change 
$("#gl-modify #acc_type").change(function(e) {
  var selectedAcc_type = $("#gl-modify #acc_type").val(); 

  if (selectedAcc_type){
       $.ajax({  
         type: "GET",
         url:'/main-list', 
         data: {},
         success:function(response){ 
             var foundAccountType_list = response.accountType_list;
             $('#gl-modify #acc_group').empty();
             $('#gl-modify #acc_group').append('<option selected disabled> Choose... </option>');
             foundAccountType_list.forEach(function(foundAccountType){
               if(foundAccountType._id==selectedAcc_type){
                 foundAccountType.accountGroup.forEach(function(accountGroup) {
                   $('#gl-modify #acc_group').append('<option value="' + accountGroup._id + '">' + accountGroup.accountGroup + '</option>');
                 })
               }
             });
         },  
         error:function(response){  
           console.log(response); 
         }  
       });  
  }
});

////////////// update --------------------------------------------------------
$('#gl-modify #update-btn').click(function(e){ 

  if(validateForm("gl-modify").form()){
        var glAccount =  $("#gl-modify #gl_account").val(); 
        var companyCode = $("#gl-modify #c_code").val();
        var accountType = $("#gl-modify #acc_type").val();
        var accountGroup = $("#gl-modify #acc_group").val();
        var glName = $("#gl-modify #gl_name").val();
        var accountCurrency = $("#gl-modify #acc_currency").val();
        var taxCategory = $("#gl-modify #tax_category").val();
        var descShort = $("#gl-modify #desc_short").val();
        var descLong = $("#gl-modify #desc_long").val();
        
              $.ajax({  
                type: "PATCH",
                url:'/md-gl', 
                data: {glAccount:glAccount,companyCode:companyCode,accountType:accountType,accountGroup:accountGroup,glName:glName,accountCurrency:accountCurrency,taxCategory:taxCategory,descShort:descShort,descLong:descLong},
                success:function(response){ 
                  
                  if(response.redirect) {
                    showLabel("gl-modify-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                  } else if (response=="Unauthorized!") {
                      showLabel("gl-modify-label", "Unauthorized user!","alert-danger");
                    }

                    else{
                      showLabel("gl-modify-label", response.errorMessage,"alert-danger");
                    }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        

  } else {

  }
        
});

////////////// delete --------------------------------------------------------
$('#gl-modify #delete-btn').click(function(e){ 

  var glAccount=$("#gl-modify #gl_account").val(); 

      if (glAccount === null)
      {
      showLabel("gl-modify-label", "Error! Please select GL Account you want to delete.","alert-danger");
      } 
      else {
        $.ajax({  
          type: "DELETE",
          url:'/md-gl', 
          data: {glAccount:glAccount},
          success:function(response){ 
            
            if(response.redirect) {
                showLabel("gl-modify-label",response.message,"alert-success");
                window.setTimeout(function() {
                  window.location = response.redirectURL;}, 1000);
            
                } else if (response=="Unauthorized!") {
                  showLabel("gl-modify-label", "Unauthorized user!","alert-danger");
                }

                else{
                  showLabel("gl-modify-label", response.errorMessage,"alert-danger");
                }
          },  
          error:function(response){  
            console.log(response); 
          }  
        });  
      }

           
});

////////////////////////////////////////////// VENDOR - MASTER DATA
//////// create
$('#vd-create-btn').click(function(e){ 

  if(validateForm("vd-create").form()){

        var vendorCode = $("#vd-create #vd_code").val(); 
        var vendorName = $("#vd-create #vd_name").val();
        var vendorCompanyCode = $("#vd-create #vd_companycode").val();
        var vendorCurrency = $("#vd-create #vd_currency").val();
        var vendorTaxCategory = $("#vd-create #vd_taxcategory").val();
        var vendorPaymentTerm = $("#vd-create #vd_term").val();
        var vendorTax = $("#vd-create #vd_tax").val();
        var vendorRecon = $("#vd-create #vd_recon").val();
        var vendorStreet = $("#vd-create #vd_street").val();
        var vendorCity = $("#vd-create #vd_city").val();
        var vendorCountry = $("#vd-create #vd_country").val();
        var vendorPostalCode = $("#vd-create #vd_postalcode").val();
        var vendorTelephone = $("#vd-create #vd_telephone").val();
        var vendorEmail = $("#vd-create #vd_email").val();
        var vendorWebsite = $("#vd-create #vd_website").val();
       
              $.ajax({  
                type: "POST",
                url:'/md-vendor', 
                data: {vendorCode:vendorCode,vendorName:vendorName,vendorCompanyCode:vendorCompanyCode,vendorCurrency:vendorCurrency,vendorTaxCategory:vendorTaxCategory,vendorPaymentTerm:vendorPaymentTerm,vendorTax:vendorTax,vendorRecon:vendorRecon,vendorStreet:vendorStreet,vendorCity:vendorCity,vendorCountry:vendorCountry,vendorPostalCode:vendorPostalCode,vendorTelephone:vendorTelephone,vendorEmail:vendorEmail,vendorWebsite:vendorWebsite},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("vd-create-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                  
                      } else if (response=="Unauthorized!") {
                        showLabel("vd-create-label", "Unauthorized user!","alert-danger");
                      } else {
                        showLabel("vd-create-label", response.errorMessage,"alert-danger");
                      }
                      
                },  
                    error:function(response){  
                      console.log(response); 
                    }  
              });



  } else {
   
  
  }
  
});

//////// modify - on change

$("#vd-modify #vd_code").change(function(e) {
  var selectedVd_code = $("#vd-modify #vd_code").val(); 

  if (selectedVd_code){
       $.ajax({  
         type: "GET",
         url:'/main-list', 
         data: {},
         success:function(response){ 
             var foundVendor_list = response.vendor_List;
            //  $('#vd-modify #vd_companycode').empty().append('<option selected disabled> Choose... </option>');
             foundVendor_list.forEach(function(foundVendor) {
              
              if(foundVendor._id==selectedVd_code) {

                $("#vd-modify #vd_name").val(foundVendor.vendorName);
                $("#vd-modify #vd_companycode").val(foundVendor.vendorCompanyCode);
                $("#vd-modify #vd_currency").val(foundVendor.vendorCurrency);
                $("#vd-modify #vd_taxcategory").val(foundVendor.vendorTaxCategory);
                $("#vd-modify #vd_term").val(foundVendor.vendorPaymentTerm);
                $("#vd-modify #vd_tax").val(foundVendor.vendorTax);
                $("#vd-modify #vd_recon").val(foundVendor.vendorRecon);
                $("#vd-modify #vd_street").val(foundVendor.vendorStreet);
                $("#vd-modify #vd_city").val(foundVendor.vendorCity);
                $("#vd-modify #vd_country").val(foundVendor.vendorCountry);
                $("#vd-modify #vd_postalcode").val(foundVendor.vendorPostalCode);
                $("#vd-modify #vd_telephone").val(foundVendor.vendorTelephone);
                $("#vd-modify #vd_email").val(foundVendor.vendorEmail);
                $("#vd-modify #vd_website").val(foundVendor.vendorWebsite);

              }
            });
         },  
         error:function(response){  
           console.log(response); 
         }  
       });  
  }
});

////////////// update --------------------------------------------------------
$('#vd-modify #update-btn').click(function(e){ 

  if(validateForm("vd-modify").form()){

      var vendorCode = $("#vd-modify #vd_code").val(); 
      var vendorName = $("#vd-modify #vd_name").val();
      var vendorCompanyCode = $("#vd-modify #vd_companycode").val();
      var vendorCurrency = $("#vd-modify #vd_currency").val();
      var vendorTaxCategory = $("#vd-modify #vd_taxcategory").val();
      var vendorPaymentTerm = $("#vd-modify #vd_term").val();
      var vendorTax = $("#vd-modify #vd_tax").val();
      var vendorRecon = $("#vd-modify #vd_recon").val();
      var vendorStreet = $("#vd-modify #vd_street").val();
      var vendorCity = $("#vd-modify #vd_city").val();
      var vendorCountry = $("#vd-modify #vd_country").val();
      var vendorPostalCode = $("#vd-modify #vd_postalcode").val();
      var vendorTelephone = $("#vd-modify #vd_telephone").val();
      var vendorEmail = $("#vd-modify #vd_email").val();
      var vendorWebsite = $("#vd-modify #vd_website").val();
        
              $.ajax({  
                type: "PATCH",
                url:'/md-vendor', 
                data: {vendorCode:vendorCode,vendorName:vendorName,vendorCompanyCode:vendorCompanyCode,vendorCurrency:vendorCurrency,vendorTaxCategory:vendorTaxCategory,vendorPaymentTerm:vendorPaymentTerm,vendorTax:vendorTax,vendorRecon:vendorRecon,vendorStreet:vendorStreet,vendorCity:vendorCity,vendorCountry:vendorCountry,vendorPostalCode:vendorPostalCode,vendorTelephone:vendorTelephone,vendorEmail:vendorEmail,vendorWebsite:vendorWebsite},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("vd-modify-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                      
                  
                  } else if (response=="Unauthorized!") {
                    showLabel("vd-modify-label", "Unauthorized user!","alert-danger");
                  } else {
                      showLabel("vd-modify-label", "error " + response.errorMessage,"alert-danger");
                }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        

  } else {

  }
        
});

////////////// delete --------------------------------------------------------
$('#vd-modify #delete-btn').click(function(e){ 

  var vendor_code =$("#vd-modify #vd_code").val();

      if (vendor_code == "")
      {
       showLabel("vd-modify-label", "Error! Please select Vendor Code you want to delete.","alert-danger");
      }

      else {

        $.ajax({  
              type: "DELETE",
              url:'/md-vendor', 
              data: {vendorCode:vendor_code},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("vd-modify-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else if (response=="Unauthorized!") {
                  showLabel("vd-modify-label", "Unauthorized user!","alert-danger");
                } else {
                    showLabel("vd-modify-label", "error " + response.errorMessage,"alert-danger");
                  }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  
      }

            
});

///////////////////////////////////////////// CUSTOMER - MASTER DATA
//////// create
$('#ct-create-btn').click(function(e){ 

  if(validateForm("ct-create").form()){

    var customerCode = $("#ct-create #ct_code").val(); 
    var customerName = $("#ct-create #ct_name").val();
    var customerCompanyCode = $("#ct-create #ct_companycode").val();
    var customerCurrency = $("#ct-create #ct_currency").val();
    var customerTaxCategory = $("#ct-create #ct_taxcategory").val();
    var customerPaymentTerm = $("#ct-create #ct_term").val();
    var customerTax = $("#ct-create #ct_tax").val();
    var customerRecon = $("#ct-create #ct_recon").val();
    var customerStreet = $("#ct-create #ct_street").val();
    var customerCity = $("#ct-create #ct_city").val();
    var customerCountry = $("#ct-create #ct_country").val();
    var customerPostalCode = $("#ct-create #ct_postalcode").val();
    var customerTelephone = $("#ct-create #ct_telephone").val();
    var customerEmail = $("#ct-create #ct_email").val();
    var customerWebsite = $("#ct-create #ct_website").val();
   
          $.ajax({  
            type: "POST",
            url:'/md-customer', 
            data: {customerCode:customerCode,customerName:customerName,customerCompanyCode:customerCompanyCode,customerCurrency:customerCurrency,customerTaxCategory:customerTaxCategory,customerPaymentTerm:customerPaymentTerm,customerTax:customerTax,customerRecon:customerRecon,customerStreet:customerStreet,customerCity:customerCity,customerCountry:customerCountry,customerPostalCode:customerPostalCode,customerTelephone:customerTelephone,customerEmail:customerEmail,customerWebsite:customerWebsite},
            success:function(response){ 
              
              if(response.redirect) {
                  showLabel("ct-create-label",response.message,"alert-success");
                  window.setTimeout(function() {
                    window.location = response.redirectURL;}, 1000);
              
              } else if (response=="Unauthorized!") {
                showLabel("ct-create-label", "Unauthorized user!","alert-danger");
              } else {
                    showLabel("ct-create-label", response.errorMessage,"alert-danger");
                  }
                  
            },  
                error:function(response){  
                  console.log(response); 
                }  
          });



  } else {
   
  
  }
  
});

//////// modify - on change

$("#ct-modify #ct_code").change(function(e) {
  var selectedCt_code = $("#ct-modify #ct_code").val(); 

  if (selectedCt_code){
    $.ajax({  
      type: "GET",
      url:'/main-list', 
      data: {},
      success:function(response){ 
          var foundCustomer_list = response.customer_List;
         //  $('#ct-modify #ct_companycode').empty().append('<option selected disabled> Choose... </option>');
         foundCustomer_list.forEach(function(foundCustomer) {
           
           if(foundCustomer._id==selectedCt_code) {

            $("#ct-modify #ct_name").val(foundCustomer.customerName);
            $("#ct-modify #ct_companycode").val(foundCustomer.customerCompanyCode);
            $("#ct-modify #ct_currency").val(foundCustomer.customerCurrency);
            $("#ct-modify #ct_taxcategory").val(foundCustomer.customerTaxCategory);
            $("#ct-modify #ct_term").val(foundCustomer.customerPaymentTerm);
            $("#ct-modify #ct_tax").val(foundCustomer.customerTax);
            $("#ct-modify #ct_recon").val(foundCustomer.customerRecon);
            $("#ct-modify #ct_street").val(foundCustomer.customerStreet);
            $("#ct-modify #ct_city").val(foundCustomer.customerCity);
            $("#ct-modify #ct_country").val(foundCustomer.customerCountry);
            $("#ct-modify #ct_postalcode").val(foundCustomer.customerPostalCode);
            $("#ct-modify #ct_telephone").val(foundCustomer.customerTelephone);
            $("#ct-modify #ct_email").val(foundCustomer.customerEmail);
            $("#ct-modify #ct_website").val(foundCustomer.customerWebsite);

           }
         });
      },  
      error:function(response){  
        console.log(response); 
      }  
    });  
}
});

////////////// update --------------------------------------------------------
$('#ct-modify #update-btn').click(function(e){ 

  if(validateForm("ct-modify").form()){

    var customerCode = $("#ct-modify #ct_code").val(); 
    var customerName = $("#ct-modify #ct_name").val();
    var customerCompanyCode = $("#ct-modify #ct_companycode").val();
    var customerCurrency = $("#ct-modify #ct_currency").val();
    var customerTaxCategory = $("#ct-modify #ct_taxcategory").val();
    var customerPaymentTerm = $("#ct-modify #ct_term").val();
    var customerTax = $("#ct-modify #ct_tax").val();
    var customerRecon = $("#ct-modify #ct_recon").val();
    var customerStreet = $("#ct-modify #ct_street").val();
    var customerCity = $("#ct-modify #ct_city").val();
    var customerCountry = $("#ct-modify #ct_country").val();
    var customerPostalCode = $("#ct-modify #ct_postalcode").val();
    var customerTelephone = $("#ct-modify #ct_telephone").val();
    var customerEmail = $("#ct-modify #ct_email").val();
    var customerWebsite = $("#ct-modify #ct_website").val();
        
              $.ajax({  
                type: "PATCH",
                url:'/md-customer', 
                data: {customerCode:customerCode,customerName:customerName,customerCompanyCode:customerCompanyCode,customerCurrency:customerCurrency,customerTaxCategory:customerTaxCategory,customerPaymentTerm:customerPaymentTerm,customerTax:customerTax,customerRecon:customerRecon,customerStreet:customerStreet,customerCity:customerCity,customerCountry:customerCountry,customerPostalCode:customerPostalCode,customerTelephone:customerTelephone,customerEmail:customerEmail,customerWebsite:customerWebsite},
                success:function(response){ 
                  
                  if(response.redirect) {
                      showLabel("ct-modify-label",response.message,"alert-success");
                      window.setTimeout(function() {
                        window.location = response.redirectURL;}, 1000);
                      
                  
                  } else if (response=="Unauthorized!") {
                    showLabel("ct-modify-label", "Unauthorized user!","alert-danger");
                  } else {
                      showLabel("ct-modify-label", "error " + response.errorMessage,"alert-danger");
                }
                },  
                error:function(response){  
                  console.log(response); 
                }  
              });  
        

  } else {

  }
        
});

////////////// delete --------------------------------------------------------
$('#ct-modify #delete-btn').click(function(e){ 

  var customer_code =$("#ct-modify #ct_code").val();

      if (customer_code == "")
      {
       showLabel("ct-modify-label", "Error! Please select Customer Code you want to delete.","alert-danger");
      }

      else {

        $.ajax({  
              type: "DELETE",
              url:'/md-customer', 
              data: {customerCode:customer_code},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel("ct-modify-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 1000);
                
                } else if (response=="Unauthorized!") {
                  showLabel("ct-modify-label", "Unauthorized user!","alert-danger");
                } else {
                    showLabel("ct-modify-label", "error " + response.errorMessage,"alert-danger");
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  
      }

            
});

/////////////// TRANSACTIONS
// Denotes total number of rows
// var rowIdx = 1;

// default values
$('#acgl-create #totalDebit').val(parseFloat(0).toFixed(2));
$('#acgl-create #totalCredit').val(parseFloat(0).toFixed(2));
$('#apvi-create #totalDebit').val(parseFloat(0).toFixed(2));
$('#apvi-create #totalCredit').val(parseFloat(0).toFixed(2));
$('#arci-create #totalDebit').val(parseFloat(0).toFixed(2));
$('#arci-create #totalCredit').val(parseFloat(0).toFixed(2));

function onChangeCompanyCode(details) {
  
  var selectedCompanyCode = details.selectedCompanyCode;
  var formID = details.formID;
  var account = details.account;

  if (selectedCompanyCode){
       $.ajax({  
         type: "GET",
         url:'/main-list', 
         data: {},
         success:function(response){ 
           if(account=="customer"){
            var foundList = response.customer_List;
             $("#"+formID+" #companyName").empty();
             $("#"+formID+" #companyName").append('<option selected disabled> Choose... </option>');
             foundList.forEach(function(foundItem){
               if(foundItem.customerCompanyCode==selectedCompanyCode){
                   $("#"+formID+" #companyName").append('<option value="' + foundItem._id + '">' + foundItem.customerCode + " -  "+ foundItem.customerName +'</option>');
               }
             });
           }
           else if(account=="vendor"){
            var foundList = response.vendor_List;
             $("#"+formID+" #companyName").empty();
             $("#"+formID+" #companyName").append('<option selected disabled> Choose... </option>');
             foundList.forEach(function(foundItem){
               if(foundItem.vendorCompanyCode==selectedCompanyCode){
                   $("#"+formID+" #companyName").append('<option value="' + foundItem._id + '">' + foundItem.vendorCode + " -  "+ foundItem.vendorName +'</option>');
               }
             });
           }
           else if(account=="gl"){
            var customerfoundList = response.customer_List;
            var vendorfoundList = response.vendor_List;
             $("#"+formID+" #companyName").empty();
             $("#"+formID+" #companyName").append('<option selected disabled> Choose... </option>');
             customerfoundList.forEach(function(cfoundItem){
               if(cfoundItem.customerCompanyCode==selectedCompanyCode){
                   $("#"+formID+" #companyName").append('<option value="' + cfoundItem._id + '">' + cfoundItem.customerCode + " -  "+ cfoundItem.customerName +'</option>');
               }
             });
             vendorfoundList.forEach(function(vfoundItem){
              if(vfoundItem.vendorCompanyCode==selectedCompanyCode){
                  $("#"+formID+" #companyName").append('<option value="' + vfoundItem._id + '">' + vfoundItem.vendorCode + " -  "+ vfoundItem.vendorName +'</option>');
              }
            });
           }
         },  
         error:function(response){  
           console.log(response); 
         }  
       });  
  }
};

// $("#acgl-create #companyCode").change(function(e) {
//     var details = {};
//     details.formID = "acgl-create";
//     details.selectedCompanyCode = $("#acgl-create #companyCode").val();
//     details.account = "customer";
//     // companyName
//     onChangeCompanyCode(details);
// });

$("#acgl-create #companyCode").change(function(e) {
  var details = {};
  details.formID = "acgl-create";
  details.selectedCompanyCode = $("#acgl-create #companyCode").val();
  details.account = "gl";
  // companyName
  onChangeCompanyCode(details);
});

$("#arci-create #companyCode").change(function(e) {
  var details = {};
  details.formID = "arci-create";
  details.selectedCompanyCode = $("#arci-create #companyCode").val();
  details.account = "customer";
  // companyName
  onChangeCompanyCode(details);
});

$("#apvi-create #companyCode").change(function(e) {
  var details = {};
  details.formID = "apvi-create";
  details.selectedCompanyCode = $("#apvi-create #companyCode").val();
  details.account = "vendor";
  // companyName
  onChangeCompanyCode(details);
});



////FUNCTIONS

// add item/row
function addRow(formID) {

  $.ajax({  
    type: "GET",
    url:'/main-list', 
    data: {},
    success:function(response){ 
        var foundGlAccount_list = response.glAccount_list;
        var user = response.user;
        $("#"+formID+"-tbody").append(
          buildGLTable(foundGlAccount_list,user));
         
    },  
    error:function(response){  
      console.log(response); 
    }  
  });  

};

// append row in table
function buildGLTable (foundGlAccount_list,user) {
  var tblRow="";
  tblRow +=  "<tr id='R'>";
  tblRow += "<td class='row-gl'>";
  tblRow += "<select name='' class='gl_Account' > ";
  tblRow += "<option selected disabled>Choose..</option>";
 
  foundGlAccount_list.forEach(function(glAccount){ 
    if(user.position == "admin") {
      tblRow +=  "<option value='" + glAccount._id +"' >" + glAccount.glAccount + "</option>";
    } else {
      glAccount.companyCode.forEach(function(accCompanyCode){
        if(user.companyCode.toString() == accCompanyCode.toString()) {
          tblRow +=  "<option value='" + glAccount._id +"' >" + glAccount.glAccount + "</option>";
        }
      });
    }
  });
  
    
  
  tblRow += "</td>";
  tblRow += "<td class='row-index'><input type='text' readonly/></td>";
  tblRow += "<td class='row-dc'> <select class='dc'>";
  tblRow += "<option value='debit'>Debit</option> <option value='credit'>Credit</option>";
  tblRow += "</select></td>";
  tblRow += "<td class='row-amount'><input type='text' class='gl_Amount' /></td>";
  tblRow += "<td class='row-cost'><input type='text' /></td>";
  tblRow += "</tr>";

  return tblRow;
}

// populate table 
function populateGLTable (foundJentry_list,foundGLAccount_list) {

  var jEntry_length = foundJentry_list.length;
  var tableRows = [];
  var i=0;

  
    foundJentry_list.forEach(function(jentry) {
      var tblRow="";
      tblRow +=  "<tr>";
      tblRow += "<td class='row-gl'>";
      tblRow += "<select class='form-select p-1' disabled > ";
      foundGLAccount_list.forEach(function(glAccount) {
        if(jentry.glID == glAccount._id)
        {
          tblRow +=  "<option selected  value='" + jentry.glID +"' >" + glAccount.glAccount + "</option>";
          tblRow += "</td>";
          tblRow += "<td class='row-index'><input type='text' value='"+glAccount.glName+"' readonly/></td>";
        }
      })
      
      tblRow += "<td class='row-dc'> <select class='form-select p-1' disabled>";
      tblRow += "<option selected  value='" + jentry.dcEntry +"' >" + jentry.dcEntry.charAt(0).toUpperCase() + jentry.dcEntry.slice(1) + " </option>";
      tblRow += "</select></td>";
      tblRow += "<td class='row-amount'><input type='text' value='"+ jentry.jAmount+"' readonly/></td>";
      tblRow += "<td class='row-cost'><input type='text' value='"+ jentry.costCenter+"' /></td>";
      tblRow += "</tr>";

      tableRows[i] = tblRow;
      i++;
      
    })
    return tableRows;

 

}

// populate table 
function populateGLTable_approver(foundJentry_list,foundGLAccount_list) {

  var jEntry_length = foundJentry_list.length;
  var tableRows = [];
  var i=0;

  
    foundJentry_list.forEach(function(jentry) {
      var tblRow="";
      tblRow +=  "<tr>";
      tblRow += "<td class='row-gl'>";
      tblRow += "<select class='form-select p-1' disabled > ";
      foundGLAccount_list.forEach(function(glAccount) {
        if(jentry.glID == glAccount._id)
        {
          tblRow +=  "<option selected  value='" + jentry.glID +"' >" + glAccount.glAccount + "</option>";
          tblRow += "</td>";
          tblRow += "<td class='row-index'><input type='text' value='"+glAccount.glName+"' readonly/></td>";
        }
      })
      
      tblRow += "<td class='row-dc'> <select class='form-select p-1' disabled>";
      tblRow += "<option selected  value='" + jentry.dcEntry +"' >" + jentry.dcEntry.charAt(0).toUpperCase() + jentry.dcEntry.slice(1) + " </option>";
      tblRow += "</select></td>";
      tblRow += "<td class='row-amount'><input type='text' value='"+ jentry.jAmount+"' readonly/></td>";
      tblRow += "<td class='row-cost'><input type='text' value='"+ jentry.costCenter+"' readonly/></td>";
      tblRow += "</tr>";

      tableRows[i] = tblRow;
      i++;
      
    })
    return tableRows;

 

}

// on change in GL ACCOUNT
function onGlAccountChange(formID,items) {
  var child = items.child;
  var theValue = items.theValue;

  $.ajax({  
    type: "GET",
    url:'/main-list', 
    data: {},
    success:function(response){ 
      var foundGlAccount_list = response.glAccount_list;
      
      child.each(function () {
        // var id = $(this).attr('id');
        var glNameRow = $(this).children('.row-index').children('input');

        foundGlAccount_list.forEach(function(glAccount) {
          if(glAccount._id==theValue) {
            glNameRow.val(glAccount.glName);
          }
        });
      });
    },  
    error:function(response){  
      console.log(response); 
    }  
  });
};


// on input in amount
function tableAmountChange(formID){
  var debitTotal = parseFloat(0);
  var creditTotal = parseFloat(0);

  $("#"+formID+"-tbody tr").each(async function(index, tr) {
      var dc = $(tr).find('td').children('.dc').val();
      var tdAmount = parseFloat($(tr).find('td').children('.gl_Amount').val());
        if (dc=="debit") {
          if(tdAmount){
            debitTotal = parseFloat(debitTotal + tdAmount);
          }
        } else {
          if(tdAmount){
            creditTotal = parseFloat(creditTotal + tdAmount);
          }
        }
  });

  $("#"+formID+"-create #totalDebit").val(parseFloat(debitTotal).toFixed(2));
  $("#"+formID+"-create #totalCredit").val(parseFloat(creditTotal).toFixed(2));

};

//check periods
function checkPeriod(details){

  var formID = details.formID;
  var accountVal = details.account;
  var postingDate =new Date($("#"+formID+"-create #postingDate").val()); 
  var postingYear = postingDate.getFullYear();
  var companyCode = $("#"+formID+"-create #companyCode").val();
 
  $.ajax({  
    type: "GET",
    url:'/main-list', 
    data: {},
    success:function(response){ 

      var controlPeriod_List = response.controlPeriod_List;

        controlPeriod_List.forEach(function(period) {
          if((accountVal==period.accountType) && (companyCode==period.companyCode) && (period.status=="open") && (period.controlYear==postingYear)) {
              var date1 = new Date(period.fromPeriod);
              var date2 = new Date(period.toPeriod);
              var dateFrom = date1.getTime();
              var dateTo = date2.getTime();
              var postDate = postingDate.getTime();


              if((postDate <= dateTo) && (postDate >= dateFrom)) {
                  saveTransaction(details);
              } else {
                showLabel(formID+"-create-label", "Posting for the period is close.","alert-danger");
              }
          } 
        });
      
    },  
    error:function(response){  
          console.log(response); 
        }  
  });
  
}

// save transaction
function saveTransaction(details){

  var formID = details.formID;
  var accountVal = details.account;

  var f1 =  formID.substring(0,2);
  var f2 =  formID.substring(2);

  if(validateForm(formID +"-create").form()){

    var documentDate = $("#"+formID+"-create #documentDate").val(); 
    var postingDate = $("#"+formID+"-create #postingDate").val(); 
    var reference = $("#"+formID+"-create #reference").val(); 
    var amount = parseFloat($("#"+formID+"-create #amount").val()).toFixed(2);
    var text = $("#"+formID+"-create #text").val();
    var companyCode = $("#"+formID+"-create #companyCode").val();
    var companyName = $("#"+formID+"-create #companyName").val();
    var currency = $("#"+formID+"-create #currency").val();

    var totalDebit= $("#"+formID+"-create #totalDebit").val();
    var totalCredit= $("#"+formID+"-create #totalCredit").val();

    var glTransaction=[];
    var child = $("#"+formID+"-tbody").children("tr");

      child.each(function () {
          var items = {};
          items.glID = $(this).children('.row-gl').children('select').val();
          items.dcEntry = $(this).children('.row-dc').children('select').val();
          items.jAmount = $(this).children('.row-amount').children('input').val();
          items.costCenter = $(this).children('.row-cost').children('input').val();
          

            if(items.jAmount) {
              if((items.glID) && (items.dcEntry) && (items.costCenter)){
                console.log(items);
                glTransaction.push(items);
              } else {
                glTransaction=[];
              } 
            } 
      });

      if((totalDebit==totalCredit) && (totalCredit==amount)){
         
        if(glTransaction.length){
            $.ajax({  
              type: "POST",
              url:'/'+f1+'-'+f2, 
              data: {account:accountVal,documentDate:documentDate,postingDate:postingDate,reference:reference,amount:amount,text:text,companyCode:companyCode,companyName:companyName,currency:currency,debit:totalDebit,credit:totalCredit,transactionType:accountVal,jlEntry:glTransaction},
              success:function(response){ 
                
                if(response.redirect) {
                    showLabel(formID+"-create-label",response.message,"alert-success");
                    window.setTimeout(function() {
                      window.location = response.redirectURL;}, 2000);
                
                } else {
                      showLabel(formID+"-create-label", response.errorMessage,"alert-danger");
                    }
                    
              },  
                  error:function(response){  
                    console.log(response); 
                  }  
            });
        } else {
          showLabel(formID+"-create-label", "Incomplete row found!","alert-danger");
        }
        
      } 
 
    else {
      console.log("Not equal");
      showLabel(formID+"-create-label", "Total Amount, Debit and Credit Values are not equal","alert-danger");
    }

  } else {

  }
}

// function fill document 
function fillViewedDocument(details,foundGLAccount_list){
  $("#showTransaction").removeClass("d-none");
  if((details.transaction.parker==details.userDetails._id) || (details.userDetails.position=="admin")){
     if(details.transaction.poster==""){
      $("#rpvd-save-btn").removeClass("d-none");
       //editable textboxes
      $("#rp-viewDoc #reference").val(details.transaction.reference);
      $("#rp-viewDoc #currency").val(details.transaction.currency);
     } else {
      $("#rp-viewDoc #reference").attr('readonly','readonly').val(details.transaction.reference);
      $("#rp-viewDoc #currency").attr('disabled','disabled').val(details.transaction.currency);
     }
  } else {
    $("#rp-viewDoc #reference").attr('readonly','readonly').val(details.transaction.reference);
    $("#rp-viewDoc #currency").attr('disabled','disabled').val(details.transaction.currency);
  }
  if((details.userDetails.position=="approver") || (details.userDetails.position=="admin")){
    if(details.transaction.poster==""){
      $("#rpvd-approve-btn").removeClass("d-none");
    }
  }
  if(details.transaction.poster!=""){
    details.userList.forEach(function(userInfo){
      if(userInfo._id==details.transaction.poster){
          $("#rpvd-posted").removeClass("d-none").text("Posted by: " + userInfo.fullname);
      }
    });
  } 

  details.userList.forEach(function(userInfo){
    if(userInfo._id==details.transaction.parker){
      $("#rpvd-parked").text("Parked by: " + userInfo.fullname);
    }
  });
  
  $("#rp-viewDoc #documentDate").attr('readonly','readonly').val(details.transaction.documentDate.substring(0, 10));
  $("#rp-viewDoc #postingDate").attr('readonly','readonly').val(details.transaction.postingDate.substring(0, 10));
  $("#rp-viewDoc #amount").attr('readonly','readonly').val(details.transaction.amount);
  $("#rp-viewDoc #text").attr('readonly','readonly').val(details.transaction.text);
  $("#rp-viewDoc #documentNumber").attr('disabled','disabled').val(details.transaction.documentNumber);
  $("#rp-viewDoc #documentID").val(details.transaction._id);
  $("#rp-viewDoc #companyCode").attr('disabled','disabled').val(details.transaction.companyCode);
  $("#rp-viewDoc #companyName").attr('disabled','disabled').val(details.transaction.companyName);
  $("#vdTable-form").removeClass("d-none");
  $("#dcForm").removeClass("d-none");
  $("#dcForm #totalDebit").val(details.transaction.debit.toLocaleString(undefined, {minimumFractionDigits: 2}));
  $("#dcForm #totalCredit").val(details.transaction.credit.toLocaleString(undefined, {minimumFractionDigits: 2}));
  $("#vdTable-tbody").append(populateGLTable(details.transaction.jEntry,foundGLAccount_list));
}



//////// onchange GL Account
$('#acgl-tbody').on('change', '.gl_Account', function () {
  var formID ="acgl";
  var items = {};
  items.child = $(this).closest('tr');
  items.theValue = $(this).val();
  onGlAccountChange(formID,items);
});

$('#arci-tbody').on('change', '.gl_Account', function () {
  var formID ="arci";
  var items = {};
  items.child = $(this).closest('tr');
  items.theValue = $(this).val();
  onGlAccountChange(formID,items);
});

$('#apvi-tbody').on('change', '.gl_Account', function () {
  var formID ="apvi";
  var items = {};
  items.child = $(this).closest('tr');
  items.theValue = $(this).val();
  onGlAccountChange(formID,items);
});

/////// on input in amount
$('#acgl-tbody').on('keyup', '.gl_Amount', function () {
  var formID = "acgl";
  tableAmountChange(formID);
});

$('#arci-tbody').on('keyup', '.gl_Amount', function () {
  var formID = "arci";
  tableAmountChange(formID);
});

$('#apvi-tbody').on('keyup', '.gl_Amount', function () {
  var formID = "apvi";
  tableAmountChange(formID);
});

//////// add row/item
$('#acgl-addItem').on('click', function () {
  var formID = "acgl";
  addRow(formID);
});

$('#arci-addItem').on('click', function () {
  var formID = "arci";
  addRow(formID);
});

$('#apvi-addItem').on('click', function () {
  var formID = "apvi";
  addRow(formID);
});

//////// create GL transaction (GL)
$('#acgl-save-btn').click(function(e){ 
  var details = {};
  details.formID ="acgl";
  details.account = "GL";
  if(validateForm(details.formID +"-create").form()){
    checkPeriod(details);
  } 
  // saveTransaction(details);
  
});

$('#arci-save-btn').click(function(e){ 
  var details = {};
  details.formID ="arci";
  details.account = "Customer";
  if(validateForm(details.formID +"-create").form()){
    checkPeriod(details);
  }
});

$('#apvi-save-btn').click(function(e){ 
  var details = {};
  details.formID ="apvi";
  details.account = "Vendor";
  if(validateForm(details.formID +"-create").form()){
    checkPeriod(details);
  }
});

//////// view document 1 (GL)
$('#rp-searchDocKeys #search-btn').click(function(e){ 

  if(validateForm("rp-searchDocKeys").form()){ 
    var docNumber = $('#rp-searchDocKeys #searchdocumentNumber').val();
    var companyCode = $('#rp-searchDocKeys #searchcompanyCode').val();
    var year = $('#rp-searchDocKeys #searchyear').val();
    var checker = 0;
    var details = {};
    
      $.ajax({  
        type: "GET",
        url:'/main-list', 
        data: {},
        success:function(response){ 
          console.log(response);
          var foundTransaction_list = response.glTransaction_List;
          var foundGLAccount_list = response.glAccount_list;
          details.userList = response.user_List;
          details.userDetails = response.user;
          foundTransaction_list.forEach(function(transaction){
            
            if ((docNumber==transaction.documentNumber) && (year==new Date(transaction.documentDate).getFullYear()) && (companyCode==transaction.companyCode))
            {
              checker = 1;
              details.transaction = transaction;
            }
          });

          if(checker){
            $("#searchForm").addClass("d-none");
            fillViewedDocument(details,foundGLAccount_list);
          } else {
              showLabel("rp-searchDocKeys-label","No document found.","alert-danger");
          }
        },  
            error:function(response){  
              console.log(response); 
            }  
      });
  } 
});

//////// view document 2 (GL)
$('#rp-searchDocRef #refsearch-btn').click(function(e){ 

  if(validateForm("rp-searchDocRef").form()){ 
    var documentReference = $('#rp-searchDocRef #documentReference').val();
    var checker = 0;
    var details = {};
    
      $.ajax({  
        type: "GET",
        url:'/main-list', 
        data: {},
        success:function(response){ 
          var foundTransaction_list = response.glTransaction_List;
          var foundGLAccount_list = response.glAccount_list;
          details.userList = response.user_List;
          details.userDetails = response.user;
          foundTransaction_list.forEach(function(transaction){
            
            if (documentReference==transaction.reference)
            {
              checker++;
              details.transaction = transaction;
            }
          });

          if(checker==1){
            $("#searchForm").addClass("d-none");
            fillViewedDocument(details,foundGLAccount_list);
          } 
          else if(checker>1) {
            showLabel("rp-searchDocRef-label","Duplicate reference found.Please try using other search method.","alert-danger");
          }
          else {
              showLabel("rp-searchDocRef-label","No document found.","alert-danger");
          }
        },  
            error:function(response){  
              console.log(response); 
            }  
      });
  }
});


// update document
$('#rpvd-save-btn').click(function(e){ 

  var reference = $("#rp-viewDoc #reference").val(); 
  var currency = $("#rp-viewDoc #currency").val();
  var documentID = $("#rp-viewDoc #documentID").val();

  var glTransaction=[];
  var child = $("#vdTable-tbody").children("tr");

      child.each(function () {
          var items = {};
          items.glID = $(this).children('.row-gl').children('select').val();
          items.dcEntry = $(this).children('.row-dc').children('select').val();
          items.jAmount = $(this).children('.row-amount').children('input').val();
          items.costCenter = $(this).children('.row-cost').children('input').val();

          glTransaction.push(items); 
      });

      $.ajax({  
        type: "POST",
        url:"/rp-vd", 
        data: {reference:reference,currency:currency,documentID:documentID,glTransaction:glTransaction},
        success:function(response){ 
          
          if(response.redirect) {
              showLabel("rpvd-label",response.message,"alert-success");
              window.setTimeout(function() {
                window.location = response.redirectURL;}, 1000);
          } else {
                showLabel("rpvd-label", response.errorMessage,"alert-danger");
              }
        },  
            error:function(response){  
              console.log(response); 
            }  
      });
});

// post document
$('#rpvd-approve-btn').click(function(e){ 

  var documentID = $("#rp-viewDoc #documentID").val();

      $.ajax({  
        type: "PATCH",
        url:"/rp-vd", 
        data: {documentID:documentID},
        success:function(response){ 
          if(response.redirect) {
              showLabel("rpvd-label",response.message,"alert-success");
              window.setTimeout(function() {
                window.location = response.redirectURL;}, 1000);
          } else {
                showLabel("rpvd-label", response.errorMessage,"alert-danger");
              }
        },  
            error:function(response){  
              console.log(response); 
            }  
      });
});

//generate document sequence
$('#genDocSeq-btn').click(function(e){ 

  if(validateForm("genDocSeq").form()){ 
    var year = $('#genDocSeq #genYear').val();
      $.ajax({  
        type: "POST",
        url:'/gl-sequence', 
        data: {year:year},
        success:function(response){ 
          if(response.redirect) {
            showLabel("docSeq-label",response.message,"alert-success");
            window.setTimeout(function() {
              window.location = response.redirectURL;}, 1000);
        } else {
              showLabel("docSeq-label", response.errorMessage,"alert-danger");
            }
        },  
            error:function(response){  
              console.log(response); 
            }  
      });
  }

  
});

//click back
$('#rpvd-back-btn').click(function(e){ 
  location.reload();
});


  // var child = $(this).closest('tr');
  // var theValue = parseFloat($(this).val());
  
  // console.log(theValue);
  
  // child.each(function () {

  //   // Getting <tr> id.
  //   // var id = $(this).attr('id');

  //   // Getting the <p> inside the .row-index class.
  //   var idx = $(this).children('.row-dc').children('select').val();
  //   // Gets the row number from <tr> id.
  //   // var dig = parseInt(id.substring(1));
  //   if (idx=="debit") {
  //     // debitTotal = debitTotal + theValue;
  //     // console.log(debitTotal);
  //     $("#totalDebit").val(theValue);
  //   } 
  //   else if (idx=="credit") {
  //     $("#totalCredit").val(theValue);
  //   } 
  //   // console.log(idx);

  //   // Modifying row index.
  // });

  

    // Modifying row id.
    // $(this).attr('id', `R${dig - 1}`);

  // // Removing the current row.
  // $(this).closest('tr').remove();

  // Decreasing total number of rows by 1.
  // rowIdx--;
 

///remove button

// // jQuery button click event to remove a row.
// $('#tbody').on('click', '.remove', function () {
  
//   // Getting all the rows next to the row
//   // containing the clicked button
//   var child = $(this).closest('tr').nextAll();

//   // Iterating across all the rows 
//   // obtained to change the index
//   child.each(function () {

//     // Getting <tr> id.
//     var id = $(this).attr('id');

//     // Getting the <p> inside the .row-index class.
//     var idx = $(this).children('.row-index').children('p');

//     // Gets the row number from <tr> id.
//     var dig = parseInt(id.substring(1));

//     // Modifying row index.
//     idx.html(`Row ${dig - 1}`);

//     // Modifying row id.
//     $(this).attr('id', `R${dig - 1}`);
//   });

//   // Removing the current row.
//   $(this).closest('tr').remove();

//   // Decreasing total number of rows by 1.
//   rowIdx--;
// });


});
 

