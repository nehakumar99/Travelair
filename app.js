// requiring modules 
const express = require('express');
const mysql      = require('mysql');

// setting up the app constant which will make use of express module 
const app = express();
// setting the view engine of ejs 
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//globally used variables
let locationRecommendations=[];


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

//handling route for sign-up
app.get('/signup',(req,res) => {
res.render('signup');
});

//app listening on port 4000
app.listen(4000, () => console.log('App listening on port 4000!'));
