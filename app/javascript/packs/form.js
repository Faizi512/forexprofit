import { cutOffByFlag } from "webpack-cli/bin/utils/errorHelpers";
import "./parsley"
import $ from "jquery"

$( document ).ready(function() {
 
debugger
var isEmail =false
var isPhone =false
var formValidation = {};

validate();




  function validate(){
    formValidation = $('#dealform').parsley({
      trigger: "focusout",
      errorClass: 'error',
      successClass: 'valid',
      errorsWrapper: '<div class="parsley-error-list"></div>',
      errorTemplate: '<label class="error"></label>',
      errorsContainer (field) {
        if(field.$element.hasClass('approve')){
          return $('.error-checkbox')
        }
        if(field.$element.hasClass('phone')){
          return $('.phoneerror')
        }
        return field.$element.parent()
      },
    })
    validatePhone()
    validateEmail()
    // validateApiPostcode()
  }

  function validatePhone(countryCode = "GB", callingCode = "44"){
    window.Parsley.addValidator('validphone', {
      validateString: function(value){
        var xhr = $.ajax('https://go.webformsubmit.com/dukeleads/restapi/v1.2/validate/mobile?key=50f64816a3eda24ab9ecf6c265cae858&value='+$('.phone').val())
        return xhr.then(function(json) {
          var skipresponse = ["EC_ABSENT_SUBSCRIBER", "EC_ABSENT_SUBSCRIBER_SM", "EC_CALL_BARRED", "EC_SYSTEM_FAILURE","EC_SM_DF_memoryCapacityExceeded", "EC_NO_RESPONSE", "EC_NNR_noTranslationForThisSpecificAddress", "EC_NNR_MTPfailure", "EC_NNR_networkCongestion"]
          debugger
          if (skipresponse.includes(json.response) && json.status == "Valid" ) {
            isPhone = true
            document.querySelector("#phone").innerHTML = document.querySelector("#phone").innerHTML + `<i class="validate success fa fa-check-circle"></i>`
            return true
          }
          else if (json.status == "Valid") {
            document.querySelector("#phone").innerHTML = document.querySelector("#phone").innerHTML + `<i class="validate success fa fa-check-circle"></i>`
            isPhone = true
            return true
          }else if(json.status == "Invalid"){
            $(".global-phone-success").removeClass("d-inline-block")
            return $.Deferred().reject(`Please Enter Valid ${countryCode} Phone Number`);
          }else if(json.status == "Error"){
            isPhone = true
            sentryNotification("critical", json , "PHONE: Error Some network api is down")
            return true
          }else{
            sentryNotification("info", json , "PHONE: Error other than the ApiDown")
            isPhone = true
            return true
          }
        }).catch(function(e) {
          if (e == `Please Enter Valid ${countryCode} Phone Number`) {
            return $.Deferred().reject(`Please Enter Valid ${countryCode} Phone Number`)
          }else{
            isPhone = true
            $(".global-phone-success").addClass("d-inline-block")
            sentryNotification("critical", e , "PHONE: Error API Down")
            return true
          }
        });
      },
      messages: {
         en: `Please Enter Valid ${countryCode} Phone Number` ,
      }
    });
  }

  function validateEmail(){
    window.Parsley.addValidator('validemail', {
      validateString: function(value){
        var xhr = $.ajax('https://go.webformsubmit.com/dukeleads/restapi/v1.2/validate/email?key=50f64816a3eda24ab9ecf6c265cae858&value='+$('.email').val());
        return xhr.then(function(json) {
          if (json.status == "Valid") {
            isEmail = true
            return true
          }else if(json.status == "Invalid"){
            return $.Deferred().reject("Please Enter Valid Email Address");
          }else{
            isEmail = true
            return true
          }
        }).catch(function(e) {
          if (e == "Please Enter Valid Email Address") {
            return $.Deferred().reject("Please Enter Valid Email Address")
          }else{
            isEmail = true
            return true
          }
        });
      },
      messages: {
         en: 'Please Enter Valid Email Address',
      }
    });
  }
 


  
 
  function geoDetection(){
    var requestUrl = "https://api.ipdata.co?api-key=3aae92264fcf46077f53ca99e8649a8bedb83a047e3fa7ab639885b3";
    $.ajax({
      url: requestUrl,
      type: 'GET',
      success: function(data){
        var inputs = document.querySelectorAll(".phone");
        inputs.forEach( (input) => {
          intlTelInput(input, { initialCountry: data.country_code, allowDropdown: true, separateDialCode: false});
        })
        var areaCode = data.calling_code
        validatePhone(data.country_code, data.calling_code)
      },
      error: function(err){
        console.log("Visitor Details Request failed, error= " + JSON.stringify(err));
      }
    });
  }
  geoDetection();

});