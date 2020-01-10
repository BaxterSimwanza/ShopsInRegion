const express = require ('express');
const exphbs = require('express-handlebars');
const app = express();
const bcryptjs = require('bcryptjs');

const passport = require('passport');
const initializePassport = require('./configurations/passport-config');
initializePassport(
    passport, //passport configuration
    email => users.find(user => user.email === email) //finding a user based on the email
);

app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));
app.engine('handlebars', exphbs({defaultLayout:'index'}));
app.set('view engine', 'handlebars');

const users = [];

app.get ('/shops', (req, res) => {
    res.render('shops');
});
app.get ('/', (req, res) => {
    res.render('shops');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/createAccount', (req, res) => {
    res.render('createAccount');
});
app.post('/createAccount', async (req, res) => {
    try{
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);
        users.push({
            id : 1,
            email : req.body.email,
            password : hashedPassword
        })
        res.redirect('login');
    }catch{
        res.redirect('createAccount');
    }
    console.log(users);
});

app.listen(5000);
console.log("Running app");