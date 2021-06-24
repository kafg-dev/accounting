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
              $.ajax({  
                type: "POST",
                url:'/gl-accounttype', 
                data: {account_type:account_type},
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
                        showLabel("acctype-label", "Company code exists!","alert-danger");
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
        

        if (account_typeID == "")
         {
          showLabel("acctype-label", "Error! Select account type from table.","alert-danger");
         }

        else {
              $.ajax({  
                type: "PATCH",
                url:'/gl-accounttype', 
                data: {account_typeID:account_typeID,account_type:account_type},
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
  $("#accgroup #accountGroupRangeFrom").val($(this).find("td")[4].innerText);
  $("#accgroup #accountGroupRangeTo").val($(this).find("td")[5].innerText);
});

//////// create
$('#accgroup-addbtn').click(function(e){ 

  if(validateForm("accgroup").form()){
          var accountGrouptypeID = $('#accGroup_typeID').val();
          var accountGroupName = $('#accountGroupName').val();
          var accountGroupRangeFrom = $('#accountGroupRangeFrom').val();
          var accountGroupRangeTo = $('#accountGroupRangeTo').val();

              $.ajax({  
                type: "POST",
                url:'/gl-accountgroup', 
                data: {accountGrouptypeID:accountGrouptypeID,accountGroupName:accountGroupName,accountGroupRangeFrom:accountGroupRangeFrom,accountGroupRangeTo:accountGroupRangeTo},
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
    var accountGroupRangeFrom = $('#accountGroupRangeFrom').val();
    var accountGroupRangeTo = $('#accountGroupRangeTo').val();
        

        if (accountGroupID == "")
         {
          showLabel("accgroup-label", "Error! Select account type from table.","alert-danger");
         }

        else {
              $.ajax({  
                type: "PATCH",
                url:'/gl-accountgroup', 
                data: {accountGroupID:accountGroupID,accountGrouptypeID:accountGrouptypeID,accountGroupName:accountGroupName,accountGroupRangeFrom:accountGroupRangeFrom,accountGroupRangeTo:accountGroupRangeTo},
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

});
    
  
 

