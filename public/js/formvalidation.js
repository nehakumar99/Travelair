//EMAIL VALIDATION CODE
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


document.getElementById('signup-btn').onclick = function(event){
    //get element
    let fn = document.getElementById('fname');
    let ln = document.getElementById('lname');
    let mail = document.getElementById('email');
    let bday = document.getElementById('bday');
    let password = document.getElementById('pass');
    let confirmPassword = document.getElementById('confirmpass');
    let phn = document.getElementById('phn');
    //get error message element
    let fnErr = document.getElementById('fname-invalid');
    let lnErr = document.getElementById('lname-invalid');
    let mailErr = document.getElementById('email-invalid');
    let passErr = document.getElementById('password-invalid');
    let confirmErr = document.getElementById('confirmpass-invalid');
    let bdayErr = document.getElementById('bday-invalid');
    let phnErr = document.getElementById('phn-invalid');
    
    if(fn.value==""){
        fnErr.innerText="Please enter a first name";
        if(fn.classList.contains('is-valid')){
         fn.classList.remove('is-valid');
         fn.classList.add('is-invalid');
        }else{
            fn.classList.add('is-invalid');
        }
        event.preventDefault();
    }

    if(fn.value!=""){
        fnErr.innerText="";
        if(fn.classList.contains('is-invalid')){
         fn.classList.remove('is-invalid');
         fn.classList.add('is-valid');
        }else{
            fn.classList.add('is-valid');
        }       
    }

    if(ln.value==""){
        lnErr.innerText="Please enter a  last name";
        if(ln.classList.contains('is-valid')){
            ln.classList.remove('is-valid');
            ln.classList.add('is-invalid');
           }else{
               ln.classList.add('is-invalid');
           }
           event.preventDefault();
    }

    if(ln.value!=""){
        lnErr.innerText="";
        if(ln.classList.contains('is-invalid')){
         ln.classList.remove('is-invalid');
         ln.classList.add('is-valid');
        }else{
            ln.classList.add('is-valid');
        }       
    }

    if(mail.value==""){
        mailErr.innerText = "Please enter a email";
        if(mail.classList.contains('is-valid')){
            mail.classList.remove('is-valid');
            mail.classList.add('is-invalid');
        }else{
            mail.classList.add('is-invalid');
        }
        event.preventDefault();
    }
   
    if(mail.value!=""){
        mailErr.innerText="";
        if(mail.classList.contains('is-invalid')){
            mail.classList.remove('is-invalid');
            mail.classList.add('is-valid');
        }else{
        mail.classList.add('is-valid');
        }
    }


    if(phn.value==""){
        phnErr.innerText="Please enter mobile number";
        if(phn.classList.contains('is-valid')){
            phn.classList.remove('is-valid');
            phn.classList.add('is-invalid');
           }else{
               phn.classList.add('is-invalid');
           }
           event.preventDefault();
    }

    if(phn.value!=""){
        phnErr.innerText="";
        if(phn.classList.contains('is-invalid')){
         phn.classList.remove('is-invalid');
         phn.classList.add('is-valid');
        }else{
            phn.classList.add('is-valid');
        }       
    }

        if(bday.value==""){
        bdayErr.innerText="Please enter your birthday";
        if(bday.classList.contains('is-valid')){
            bday.classList.remove('is-valid');
            bday.classList.add('is-invalid');
           }else{
               bday.classList.add('is-invalid');
           }
           event.preventDefault();
    }

    if(bday.value!=""){
        bdayErr.innerText="";
        if(bday.classList.contains('is-invalid')){
         bday.classList.remove('is-invalid');
         bday.classList.add('is-valid');
        }else{
            bday.classList.add('is-valid');
        }       
    }


    if(password.value==""){
        passErr.innerText="Please enter password";
        if(password.classList.contains('is-valid')){
            password.classList.remove('is-valid');
            password.classList.add('is-invalid');
           }else{
               password.classList.add('is-invalid');
           }
           event.preventDefault();
    }

    if(password.value!=""){
        passErr.innerText="";
        if(password.classList.contains('is-invalid')){
         password.classList.remove('is-invalid');
         password.classList.add('is-valid');
        }else{
            password.classList.add('is-valid');
        }       
    }

    if(confirmPassword.value==""){
        confirmErr.innerText="Please confirm password";
        if(confirmPassword.classList.contains('is-valid')){
            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
           }else{
            confirmPassword.classList.add('is-invalid');
           }
           event.preventDefault();
    }

    if(confirmPassword.value!=""){
        confirmErr.innerText="";
     if(confirmPassword.value==password.value){
        if(confirmPassword.classList.contains('is-invalid')){
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.add('is-valid');
           }else{
            confirmPassword.classList.add('is-valid');
           }
     } else{
         if(confirmPassword.classList.contains('is-valid')){
            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
           }else{
            confirmPassword.classList.add('is-invalid');
           }
           confirmErr.innerText="Passwords dont match";
           event.preventDefault();
     }
    }
    if((validateEmail(mail.value))==false){
        if(mail.classList.contains('is-valid')){
            mail.classList.remove('is-valid');
            mail.classList.add('is-invalid');
            mailErr.innerText="Enter a valid email";
        }else if(mail.classList.contains('is-invalid')){
            mailErr.innerText="Enter a valid email";
        }
        else{
            mailErr.innerText="Enter a valid email";
            mail.classList.add('is-invalid');
        }
        event.preventDefault();
    }

    if(phn.value.length !=10 || isNaN(phn.value)){
    if(phn.classList.contains('is-valid')){
        phn.classList.remove('is-valid');
        phn.classList.add('is-invalid');
        phnErr.innerText="Please enter valid 10 digit number";
    }
    else if(phn.classList.contains('is-invalid')){
        phnErr.innerText="Please enter valid 10 digit number";
    }else{
        phn.classList.add('is-invalid');
        phnErr.innerText="Please enter valid 10 digit number";
    }
    }
}