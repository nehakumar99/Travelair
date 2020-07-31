//function for email validation
alert("hggg");
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
function emailCheckError(emailField,msgField){
    if(emailField.innerText ==""){
        msgField.innerText="Please enter valid email";
        emailField.classList.add('is-invalid');
        event.preventDefault();      
    }
    if(emailField.innerText !=""){
        if(validateEmail(emailField.innerText)){
            msgField.innerText="Please enter valid email";
            emailField.classList.add('is-invalid');   
            event.preventDefault();
        }
           else{
               emailField.classList.remove('is-invalid');
               emailField.classList.add('is-valid');
               msgField.innerText="";
           }
    }
    console.log(emailField.innerText);
    console.log(emailField.value);

}

//function for checking name field
function nameCheck(name,msgField){
if(name.value == null)
{
  name.classList.add('is-invalid');
  msgField.innerText="Please enter valid name";
  event.preventDefault();
}
else{
    if(name.classList.contains('is-invalid')){
        name.classList.remove('is-invalid');
    }
    name.classList.add('is-valid');
    msgField.innerText="";
}
}
//function to check phone number 
function phoneCheck(phn,msgField){
    if(phn.innerText==""){
        phn.classList.add('is-invalid');
        msgField.innerText = "Please enter phone number";
        event.preventDefault();
    }
    else if(phn.innerText != "") {
        if(phn.length()!=10)
        {   
            phn.classList.add('is-invalid');
            msgField.innerText = "Please enter ten digit number";
            event.preventDefault();
        }
        else if(isNaN(phn.innerText)){
            phn.classList.add('is-invalid');
            msgField.innerText = "Please enter  number";
            event.preventDefault();
        }
        else{
            msgField.innerText ="";
            phn.classList.add('is-valid');
            phn.classList.remove('is-invalid');
        }
    }
}

// function for checking the password 
function passwrdCheck(pass,msgField,event){
    if((pass.innerText).length !=8){
        pass.classList.add('is-invaid');
        msgField.innerText="Please enter 8 characters password";
        event.preventDefault();
    }
}

//on clicking the signup button
document.getElementById('signup-btn').onclick = function(event){
let emailMsg = document.getElementById('email-invalid');
let fnameMsg = document.getElementById('fname-invalid');
let lnameMsg = document.getElementById('lname-invalid');
let phnMsg = document.getElementById('phn-invalid');
// confirmpass-invalid
let passMsg = documen.getElementById('password-invalid');
let confirmMsg = document.getElementsByClassName('confirmpass-invalid');
   // the signup page variables 
let fName=document.getElementById('fname');
let lName = document.getElementById('lname');
let Semail = document.getElementById('email');
let Sphn = document.getElementById('phn');
let bday = document.getElementById('bday');
let Spassword = document.getElementById('pass');
let SpasswordConfirm = document.getElementById('confirmpass');
emailCheckError(Semail);
nameCheck(fName,fnameMsg);
nameCheck(lName,lnameMsg);
phoneCheck(Sphn,phnMsg);
passwrdCheck(Spassword,passMsg);
}

