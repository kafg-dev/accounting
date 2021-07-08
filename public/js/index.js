$(document).ready(function() {
  //////tables
  $("#companyCodeTable").DataTable();
  $("#accountTypeTable").DataTable();
  $("#accountGroupTable").DataTable();
  

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

  /////////company code --------------------------------------------------------

 //////// table on click
  $("#companyCodeTable").on("click", "tr", function() {
    showDiv("onSelectDiv","ccode");
    $("#ccode #selectedCompanyCode").val($(this).find("td")[1].innerText); 
    $("#ccode #company_codeID").val($(this).find("td")[0].innerText);
    $("#ccode #company_code").val($(this).find("td")[1].innerText); 
    $("#ccode #company_country").val($(this).find("td")[2].innerText); 
    $("#ccode #company_currency").val($(this).find("td")[3].innerText);
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
         var companyCountry = $('#company_country').val();
         var companyCurrency = $('#company_currency').val();

                $.ajax({  
                  type: "POST",
                  url:'/gn-companycode', 
                  data: {company_codeID:companyCodeID,company_code:companyCode,company_country:companyCountry,company_currency:companyCurrency},
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
                  data: {company_codeID:companyCodeID,company_code:companyCode,company_country:companyCountry,company_currency:companyCurrency},
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
                  
                  } else {
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
                      
                  
                  } else {
                      showLabel("gl-modify-label", "error " + response.errorMessage,"alert-danger");
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
            
            } else {
              if(response.error){
                showLabel("gl-modify-label", "error " + response.errorMessage,"alert-danger");
              }
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
                
                } else {
                  if(response.error){
                    showLabel("vd-modify-label", "error " + response.errorMessage,"alert-danger");
                  }
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
                
                } else {
                  if(response.error){
                    showLabel("ct-modify-label", "error " + response.errorMessage,"alert-danger");
                  }
              }
              },  
              error:function(response){  
                console.log(response); 
              }  
            });  
      }

            
});

});
    
  
 

