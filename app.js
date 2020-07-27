// requiring modules 
require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const uniqid = require('uniqid');

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
let flightShow = [];
let selected;
let passengers;
let totalPrice;
let passengersData=[];
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

//route handling editing user phone number
app.get('/edituserphone',(req,res) => {
res.render('editphone');
});

app.post('/edituserphone',(req,res) => {
connection.query('UPDATE login_data SET PHONE_NO = ? WHERE EMAIL_ID = ?',[req.body.editphn,user],(error,results) => {
if(!error) { res.redirect('/profile'); }
});
});

// route handling the booking page1
app.get('/bookingpage1',(req,res) => {
res.render('bookingpage1',{locations:locationRecommendations,flights:flightShow});
});
app.post('/bookingpage1',(req,res) => {
const toLoc = req.body.to;
const fromLoc = req.body.from;
const boardingDate = req.body.boardingdate;
passengers = req.body.noofpass;
const seatClass = String(req.body.seat);
let sql="";
// setting query string as per user options 
if(seatClass == 'First')
{
  sql=`SELECT DISTINCTROW(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ))) AS "FLIGHT_ID",(SELECT schedule_data.BOARDING_DATE FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ))) AS "BOARDING_DATE",(SELECT schedule_data.BOARDING_TIME FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ?) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ?))) AS "BOARDING_TIME",(SELECT fare_data.F_SEAT_PRICE FROM fare_data WHERE fare_data.FLIGHT_ID IN (SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? )))) AS "SEAT_PRICE" FROM airport_data,schedule_data,fare_data,flight_data WHERE flight_data.F_SEAT_AVL>= ? AND schedule_data.BOARDING_DATE = ? `;
}
else if (seatClass == 'Economy')
{
  sql=`SELECT DISTINCTROW(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ))) AS "FLIGHT_ID",(SELECT schedule_data.BOARDING_DATE FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ))) AS "BOARDING_DATE",(SELECT schedule_data.BOARDING_TIME FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ?) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ?))) AS "BOARDING_TIME",(SELECT fare_data.E_SEAT_PRICE FROM fare_data WHERE fare_data.FLIGHT_ID IN (SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? )))) AS "SEAT_PRICE" FROM airport_data,schedule_data,fare_data,flight_data WHERE flight_data.E_SEAT_AVL>= ? AND schedule_data.BOARDING_DATE = ? `; 
}
else
{
  sql=`SELECT DISTINCTROW(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ))) AS "FLIGHT_ID",(SELECT schedule_data.BOARDING_DATE FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ))) AS "BOARDING_DATE",(SELECT schedule_data.BOARDING_TIME FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ?) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ?))) AS "BOARDING_TIME",(SELECT fare_data.B_SEAT_PRICE FROM fare_data WHERE fare_data.FLIGHT_ID IN (SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FLIGHT_ID IN(SELECT schedule_data.FLIGHT_ID FROM schedule_data WHERE schedule_data.FROM_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? ) AND schedule_data.TO_AIRPORT_ID IN(SELECT airport_data.AIRPORT_ID FROM airport_data WHERE airport_data.LOCATION = ? )))) AS "SEAT_PRICE" FROM airport_data,schedule_data,fare_data,flight_data WHERE flight_data.B_SEAT_AVL>= ? AND schedule_data.BOARDING_DATE = ? `; 
}
connection.query(sql,[fromLoc,toLoc,fromLoc,toLoc,fromLoc,toLoc,fromLoc,toLoc,passengers,boardingDate],function(error,results)
{
if(!error)
{    
      results.forEach(result => {
        flightShow.push(result);
      });
  res.redirect('/bookingpage1');
 }
});
});
// route hndling booking page 2 
app.post('/bookingpage2', function(req,res){
 selected = (String(req.body.flight)).trim();
  let price;
  for (const i in flightShow) {
    if (flightShow[i].FLIGHT_ID == selected)
     price = flightShow[i].SEAT_PRICE;
     const choice = {
       FLIGHT_ID:flightShow[i].FLIGHT_ID,
     }
    }
  totalPrice = Number(passengers)*price;
  res.redirect('/bookingpage2');
 });
 app.get('/bookingpage2',(req,res) => {
 res.render('bookingpage2',{passengers:passengers});
 });
  //  ROUTE HANDLING CONFIRMATIONPAGE 
app.post('/confirmation', (req,res) => {
const passenger = {
  firstName: req.body.fname,
  lastName:req.body.lname,
  age:req.body.age,
  gender:req.body.gender
};
passengersData.push(passenger);
res.redirect('/confirmation');
});
app.get('/confirmation', (req,res) => {
res.render('confirmation',{passengers:passengers,totalPrice:totalPrice});
});
// route handling payments portal page 
app.get('/paymentsportal',(req,res) => {
res.redirect('/successfulbooking')
});
//app listening on port 4000
app.listen(4000, () => console.log('App listening on port 4000!'));
