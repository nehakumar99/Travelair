//on clicking the submit button for signup
document.getElementById('signup-btn').onclick = function(event){
   //elements for displaying the error messages 
    let emailMsg = document.getElementById('email-invalid');
    let fnameMsg = document.getElementById('fname-invalid');
    let lnameMsg = document.getElementById('lname-invalid');
    let phnMsg = document.getElementById('phn-invalid');
    let passMsg = documen.getElementById('password-invalid');
    let confirmMsg = document.getElementsByClassName('confirmpass-invalid');
  //form elements
    let fName=document.getElementById('fname');
    let lName = document.getElementById('lname');
    let Semail = document.getElementById('email');
    let Sphn = document.getElementById('phn');
    let bday = document.getElementById('bday');
    let Spassword = document.getElementById('pass');
    let SpasswordConfirm = document.getElementById('confirmpass');
    //calling the functions for validation
    event.preventDefault();
    emailCheck(Semail,emailMsg);
}
//function for email validation
function validateEmail(emailField){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(emailField) == false) 
    {
     return false;
    }
else{
     return true;
}  
}
//function for email validation part 2
function emailCheck(emailField,msgField){
    if(emailField.value == null){
        msgField.innerText="Please enter valid email";
        emailField.classList.add('is-invalid');
        event.preventDefault;      
    }
    if(emailField.value != null){
        if(validateEmail(emailField.value)==false){
            msgField.innerText="Please enter valid email";
            emailField.classList.add('is-invalid');   
            event.preventDefault;
        }
           else{
               emailField.classList.remove('is-invalid');
               emailField.classList.add('is-valid');
               msgField.innerText="";
           }
    }
}