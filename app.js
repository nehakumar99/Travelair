// requiring modules 
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// setting up the app constant which will make use of express module 
const app = express();
// setting the view engine of ejs 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//globally used variables
let locationRecommendations=[];
let userExists = false;
//setting up database connection
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'airlines_reservation_system'
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
  if(locationRecommendations.length === 0)
  {
    connection.query("SELECT * FROM pic_data", (error, results) => {
      if(!error)
        {
        results.forEach(result => {
        locationRecommendations.push(result);   
        });
      }
      res.redirect('/'); 
    });
  }
  else{
    res.render('home',{recommendations:locationRecommendations});
  }
});

// handling route for login 
// app.post('/login',(req,res) => {
// const mail = req.body.
// });
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
res.render('profile');
});
//app listening on port 4000
app.listen(4000, () => console.log('App listening on port 4000!'));
