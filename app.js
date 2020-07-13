// requiring modules 
const express = require('express');

// setting up the app constant which will make use of express module 
const app = express();
// setting the view engine of ejs 
app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views'); 
app.use(express.static(__dirname + '/public'));


//handling route for home
app.get('/', (req, res) => {
  res.render('home');
});

//handling route for sign-up
app.get('/signup',(req,res) => {
res.render('signup');
});

//app listening on port 4000
app.listen(4000, () => console.log('App listening on port 4000!'));
