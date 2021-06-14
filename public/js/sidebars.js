/* global bootstrap: false */
(function () {
    'use strict'
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })()

// check the link
  var mainLink = $(location).attr("href");
  var longLink = mainLink.substr(mainLink.lastIndexOf('/') + 1);
  var shortLink = mainLink.substr(mainLink.lastIndexOf('/') + 1,2);
 
  checkLink (shortLink, longLink);

function checkLink (shortL, longL) {
    switch (shortL) 
    {
      case "md":
        $("a[href$="+longL+"]").addClass("btn-color");
        $("#mtab-1").addClass("btn-color");
        $("#mtab-1").attr("aria-expanded", "true");
        $("#home-collapse").addClass("show");
      break;

      case "ac":
        $("a[href$="+longL+"]").addClass("btn-color");
        $("#mtab-2").addClass("btn-color");
        $("#mtab-2").attr("aria-expanded", "true");
        $("#accounting-collapse").addClass("show");
        $("#accounting-gl").addClass("show");
        $("#mtab-2-sub1").attr("aria-expanded", "true");
      break;

      case "ar":
        $("a[href$="+longL+"]").addClass("btn-color");
        $("#mtab-2").addClass("btn-color");
        $("#mtab-2").attr("aria-expanded", "true");
        $("#accounting-collapse").addClass("show");
        $("#accounting-ar").addClass("show");
        $("#mtab-2-sub2").attr("aria-expanded", "true");
      break;

      case "ap":
        $("a[href$="+longL+"]").addClass("btn-color");
        $("#mtab-2").addClass("btn-color");
        $("#mtab-2").attr("aria-expanded", "true");
        $("#accounting-collapse").addClass("show");
        $("#accounting-ap").addClass("show");
        $("#mtab-2-sub3").attr("aria-expanded", "true");
      break;
      
      default :
            console.log(clickedLink);

    }
}