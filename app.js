// requiring modules 
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

// setting up the app constant which will make use of express module 
const app = express();
// setting the view engine of ejs 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//globally used variables
let locationRecommendations=[];
let userExists = false;
let user;
let editUser;
let userInfo =[];
let passwordOTP;
let passwordResetMsg;
//setting up database connection
const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

//setting up the email service
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:process.env.EMAIL,
    pass:process.env.PASSWORD
  }
});

connection.connect(function(err) {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});


//handling route for home
app.get('/', (req, res) => {
  if(locationRecommendations.length === 0){
    connection.query("SELECT * FROM pic_data", (error, results) => {
      if(!error){
        results.forEach(result => {
        locationRecommendations.push(result);   
        });
      }
    res.redirect('/'); 
  });
}else{
 res.render('home',{recommendations:locationRecommendations});
  }
});

// handling route for login 
app.post('/login',(req,res) => {
const mail = req.body.useremail;
const password = req.body.userpassword;
let findUser = 'SELECT *FROM login_data WHERE EMAIL_ID ='+mysql.escape(mail);
connection.query(findUser,(error,results) => {
 if(!error){
   if(results.length == 0){
     userExists = false;
     res.redirect('/');
   }else{
     for ( let i in results) {
     if(results[i].PASSWORD != password){
       res.redirect('/');
     }else{
       user = String(mail);
       res.redirect('/profile');
     }
    }
  }
 }
})
});
//handling route for sign-up
app.get('/signup',(req,res) => {
res.render('signup');
});
app.post('/signup',(req,res) => {
  //storing the values for user sign up
  const fname = req.body.userfname;
  const lname = req.body.userlname;
  const phn = req.body.userphn;
  const mail = req.body.userEmail;
  const password = req.body.userpass;
  const bday = req.body.userbday;
  userExists=false;
  let check = 'SELECT *FROM customer_data WHERE EMAIL_ID ='+ mysql.escape(mail);
  connection.query(check,(error,results) => {
  if(!error){
    if(results.length == 0){
      let register = 'INSERT INTO customer_data SET ?';
      connection.query(register,{EMAIL_ID:mail,FIRST_NAME:fname,LAST_NAME:lname,PHONE_NO:phn,BIRTHDAY:bday},(error,results)=> {
        if(!error){
          let saveInfo = 'INSERT INTO login_data SET ?';
          connection.query(saveInfo,{EMAIL_ID:mail,PASSWORD:password},(error,results)=>{
            user = String(mail);
            res.redirect('/profile');
          })
        }
      })
    }else{
      userExists = true;
      res.redirect('/signup');
    }
  }
  })
});

//handling route for profile
app.get('/profile',(req,res) => {
 let profileQuery = 'SELECT *FROM customer_data WHERE EMAIL_ID = '+ mysql.escape(user);
 if(userInfo.length == 0){
  connection.query(profileQuery,(error,results) => {
    if(!error){
    results.forEach(result => {
     userInfo.push(result);
    });
  } res.redirect('/profile');
 })
 }else{
  res.render('profile',{userInfo:userInfo});
 }
 console.log(userInfo);
});
// route handling pages of forgot password
app.get('/forgotpasswordpg1',(req,res) => {
passwordOTP="";
res.render('forgotpasswordpg1',{errorMsg:passwordResetMsg});
});

app.post('/forgotpasswordpg1',(req,res) => {
editUser = req.body.mail;
let findUser = 'SELECT *FROM login_data WHERE EMAIL_ID ='+mysql.escape(editUser);
connection.query(findUser,(error,results) => {
if(results.length == 0){
passwordResetMsg="You dont have an account with this email";
res.redirect('/forgotpasswordpg1');
}else{
  passwordResetMsg="";
  passwordOTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  res.redirect('/forgotpasswordpg2');
}
});
});

app.get('/forgotpasswordpg2', (req,res) => {
console.log(passwordOTP);
let mailOptions = {
  from: process.env.EMAIL,
  to: editUser,
  subject: 'Reset password',
  text:'Enter the given OTP:' + passwordOTP
};
transporter.sendMail(mailOptions,function(err){
  if(!err)  console.log("Email successfully sent!");
  else  console.log(err);
});
res.render('forgotpasswordpg2',{errorMsg:passwordResetMsg});
});

app.post('/forgotpasswordpg2',(req,res) => {
if(req.body.otp == passwordOTP){
  res.redirect('/resetpassword');
  passwordResetMsg="";
}else{
  passwordResetMsg="You entered wrong OTP";
  res.redirect('/forgotpasswordpg2');
}
});

app.get('/resetpassword',(req,res) => {
res.render('resetpassword');
});

app.post('/resetpassword', (req,res) => {
connection.query('UPDATE login_data SET PASSWORD = ? WHERE EMAIL_ID = ?',[req.body.newpassword,editUser], (error) => {
  if(error) console.log(error);
  else res.redirect('/resetsuccess');
})
});

app.get('/resetsuccess', (req,res) => {
res.render('resetsuccess');
});

//app listening on port 4000
app.listen(4000, () => console.log('App listening on port 4000!'));
