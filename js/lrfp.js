
 // Getting the page name and calling functions based on the page thaht user is on

 var getPage = document.URL.split("/");
 var pageName = getPage[getPage.length - 1];
 
window.onload = function() {
    if(document.URL == "http://vulovic.rs/plantlife/") {
        location.replace("http://vulovic.rs/plantlife/index.html")   
    }
   

    // Calling the function for regular expression on the register page
    if(pageName == "register.html") {
        document.querySelector("#registerBtn").addEventListener('click', registerCheck);
        document.querySelector("#userConfirmPassword").addEventListener('blur', checkConfirmPassword);
        document.querySelector("#registerBtn").addEventListener('click', chekEmailPassword);
            // Check password and email
    } else if(pageName == "login.html") {
        //document.querySelector("#loginBtn").addEventListener('click', chekEmailPassword);
        document.querySelector("#loginBtn").addEventListener('click', loginCheck);
        document.querySelector('#keepSignedin').addEventListener('click', remmemberMe);
        checkedRemmemberMe()
      
    } else if(pageName == "forgot_password.html") {
        document.querySelector("#forgotBtn").addEventListener('click', checkEmail);
    } else if (pageName == "index.html") {
        document.querySelector("#btnNewsletter").addEventListener('click', subscribe);
        $('#showModalA').click(function(e){
            e.preventDefault();
            $('#showModal').css('display', 'block')
        })
    } 
     if (pageName == "contact.html") {
        document.querySelector("#contactBtn").addEventListener('click', contactCheck);
    }



}// End of window.onload

var arrayError = [];
  var arrayOk = []; 
  var arrayLoginLS = [];

function checkRegisterPage() {
   // Get elements
  var userName, userLastname, agreeTerms, regUserName, regUserLastname;
  

  //Getting users input
  userName = document.querySelector("#userName").value.trim();
  userLastname = document.querySelector("#userLastname").value.trim();
  agreeTerms = document.querySelector("#agreeTerms").checked;



//Checking users input with Regular Expressions
  regUserName = /^[A-Z][a-z]{2,14}(\s[A-Z][a-z]{2,14})?$/;
  regUserLastname = /^[A-Z][a-z]{2,14}$/;
  
  // Getting elements for writting mistakes


  // Comparing data with regular expressions
    if (!regUserName.test(userName)) {
        document.querySelector("#nameError .errorMsg").innerHTML = "Name is not entered correctly";
        document.querySelector("#nameError").style.display = "block";
        arrayError.push('Name is not entered correctly');	
    } else {
        document.querySelector("#nameError .errorMsg").innerHTML = "";
        document.querySelector("#nameError").style.display = "none";
        arrayOk.push(userName);
        
    }

  
    if (!regUserLastname.test(userLastname)) {
        document.querySelector("#lastnameError .errorMsg").innerHTML = "Lastname is not entered correctly";
        document.querySelector("#lastnameError").style.display = "block";
        arrayError.push('Lastname is not entered correctly');	
    } else {
        document.querySelector("#lastnameError .errorMsg").innerHTML = "";	
        document.querySelector("#lastnameError").style.display = "none";
        arrayOk.push(userLastname);	
    }


// Checking if the Terms are checked
    if(!agreeTerms) {
        document.querySelector("#termsError p").innerHTML = "You didn't agree with our terms and policies";
        document.querySelector("#termsError").style.display = "block";
        arrayError.push("You didn't agree with our terms and policies");
    } else {
        document.querySelector("#termsError p").innerHTML = "";
        document.querySelector("#termsError").style.display = "none";
        arrayOk.push("Accepted Terms&Services");
    }

}


function registerCheck(){
    checkRegisterPage()
    /* Going though data */
    if(arrayError != 0) {
        console.log("Data is not valid");
    } else {
        if(checkEmail || checkConfirmPassword)
        {
            arrayOk.push(userEmail.value, userPassword.value)
            arrayLoginLS.push(userEmail.value, userPassword.value)
        }
        // Setting register information in localstorage
        localStorage.setItem('registeredUser', JSON.stringify(arrayOk));
        //Returning user message that he was successfully registered
        $('.fullSectionBody-body').html("You have been successfully registered.");

        //Setting data in localstorage for login check and remmemberMe checkbox to prefill fields
        localStorage.setItem("loginParams", JSON.stringify(arrayLoginLS));

    }
    arrayError = [];
}


function checkConfirmPassword() {
    let isValid = false;
    var  userConfirmPassword, userPassword;
    
    userPassword = document.querySelector("#userPassword").value;
    userConfirmPassword = document.querySelector("#userConfirmPassword").value;

    
   if(userPassword != userConfirmPassword) {
        document.querySelector("#userConfirmError .errorMsg").innerHTML = "Your password and confirmed password don't match";
        document.querySelector("#userConfirmError").style.display = "block";
        isValid = false;
    } else {
        document.querySelector("#userConfirmError .errorMsg").innerHTML = "";
        document.querySelector("#userConfirmError").style.display = "none";
        isValid = true;
    }
    return userPassword;
}

function checkEmail() {
    let isValid = false;
    var userEmail, regEmail;

    userEmail = document.querySelector("#userEmail").value;
    regEmail =  /^[a-z$.-_0-9]+\@[a-z.-_]+\.[a-z.]+$/;

    if (!regEmail.test(userEmail)) {
        document.querySelector("#emailError .errorMsg").innerHTML = "Email is not entered correctly";
        document.querySelector("#emailError").style.display = "block";
        isValid = false;
    } else {
        document.querySelector("#emailError .errorMsg").innerHTML = "";
        document.querySelector("#emailError").style.display = "none";
        isValid = true;	
    }
  return isValid;
}

function chekEmailPassword() {
    let isValid = false;
    var userPassword = document.querySelector("#userPassword").value;
    var regPass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;

    if(!regPass.test(userPassword)) {
        document.querySelector("#passwordError .errorMsg").innerHTML = "Passwords is not valid.";
        document.querySelector("#passwordError").style.display = "block";
            if(pageName == "register.html") {
                document.querySelector("#passwordError .errorMsg").innerHTML = "Passwords must contain at least six characters, including uppercase, lowercase letters and numbers.";
                document.querySelector("#passwordError").style.display = "block";
            }
        isValid = false;
        
    } else {
        document.querySelector("#passwordError .errorMsg").innerHTML = "";
        document.querySelector("#passwordError").style.display = "none";
        if(pageName == "register.html") {
            document.querySelector("#passwordError .errorMsg").innerHTML = "";
            document.querySelector("#passwordError").style.display = "none";
        }
        isValid = true;
    }


    checkEmail();
    return isValid;

}
function checkMessage() {
    var isValid = false;
    var message = document.querySelector("#contactMessage").value.trim();
    var regMessage = /^[A-Z]([a-z\s""'',-_.])+$/;

    if (!regMessage.test(message)) {
        document.querySelector("#messageError .errorMsg").innerHTML = "Message is not entered correctly";
        document.querySelector("#messageError").style.display = "block";
        isValid = false;
	} else {
		document.querySelector("#messageError .errorMsg").innerHTML = "";
        document.querySelector("#messageError").style.display = "none";
        isValid = true;
    }
    return isValid;
}

/* ============ REMMEMBER ME ================= */

//Get data from localstorage
function getDataForLogin() {
    return JSON.parse(localStorage.getItem('loginParams'));
}

function loginCheck() {
    //Get data from localstorage
    var userLoginParametars = getDataForLogin();
    
    if(userLoginParametars) {
        var username = userLoginParametars[0];
        var password = userLoginParametars[1];
      }
    // Getting values form users input
    let prefilUsername  = document.querySelector("#userEmail").value;
    let prefilUserEmail = document.querySelector("#userPassword").value;

    //Checking if user has been registered, with data form his/hers localstorage
    if((prefilUsername == username) && (prefilUserEmail == password)) {
        //Redirect to shop page
        location.replace("http://vulovic.rs/plantlife/pages/register.html")   
    } else {
        chekEmailPassword();
        //$('.fullSectionBody-body').html("<h2>You are not register user. You can <a href='register.html'>Register</a> here. <h2>");
    }

}

function checkedRemmemberMe() {
    let prefillDataForLoginFromLS = localStorage.getItem('remmemberMe');
    if(prefillDataForLoginFromLS == "yes") {
        //set checkbox to checked
        document.querySelector("#keepSignedin").setAttribute('checked', 'checked');
        remmemberMe()
    } 
}
function remmemberMe(){
    // Insert into localstorage check user to refill the data everytime
    localStorage.setItem("remmemberMe", 'yes');

    //Get data from localstorage
    var userLoginParametars = getDataForLogin()

    if(userLoginParametars) {
    var username = userLoginParametars[0];
    var password = userLoginParametars[1];
  }
        //Get checkbox remmemberMe
     let checkedremmemberMe = document.querySelector("#keepSignedin").checked;

     if(checkedremmemberMe) {
         //Prefill the email and username fields
         document.querySelector("#userEmail").setAttribute('value', username);
         document.querySelector("#userPassword").setAttribute('value', password) 

         //Remove error Messages
         document.querySelector("#passwordError").style.display = "none";   
         document.querySelector("#emailError").style.display = "none";

     } else if(!checkedremmemberMe) {
        //Remove from lcalstorage when checkbox remmember me is unchecked
        localStorage.removeItem("remmemberMe"); 
         //Remove form prefilled email and username fields
         document.querySelector("#userEmail").setAttribute('value', '');
         document.querySelector("#userPassword").setAttribute('value', '');
    }
 }

 /* ============== NEWSLETTER ================ */

 function subscribe() {
    var emailCheckOk = checkEmail()
    var getUsersSub = JSON.parse(localStorage.getItem('subscribedUser'));
   
    if(emailCheckOk) {
        var subsctibedUser = userEmail.value;
         localStorage.setItem('subscribedUser', JSON.stringify(subsctibedUser));
 
         if(getUsersSub == subsctibedUser){
            //Ispisi da se vec subscribe-ova na email
            document.querySelector("#newsletter").innerHTML = "<h2>There is already registered user with that address</h2>"
        } else {
            //Return success message
            document.querySelector("#newsletter").innerHTML = "<h2>You are now subscribed</h2>"
        }
    } 
    

 }

 /* ================ CONTACT PAGE ============== */
 function contactCheck() {
    checkRegisterPage() 
    checkMessage()

   
    let  arrayContactOk = [];
    

    if((arrayError != 0)){
        console.log(arrayError)
    } else {
        var messageTextarea = document.querySelector("#contactMessage").value;
      //Getting the data from user
      arrayContactOk.push(userName.value, userLastname.value, userEmail.value, messageTextarea);

      //Giving the user message
      document.querySelector("#contact").innerHTML = "<h2>Your message was sent successfully</h2>";

    }
    arrayError = [];
 }