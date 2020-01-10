if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express');
const exphbs = require('express-handlebars');
const app = express();
const bcryptjs = require('bcryptjs');

const flash = require('express-flash');
const session = require('express-session');

const methodOverride = require('method-override');

const passport = require('passport');
const initializePassport = require('./configurations/passport-config');
initializePassport(
    passport,                                          //passport configuration
    email => users.find(user => user.email === email),//finding a user based on the email
    id =>  users.find(user => user.id === id)
);

app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));

app.use(flash());
app.use(session({
    secret : process.env.SESSION_SECTRET, //secret
    resave : false, //should we resave session values if nothing has changed
    saveUninitialized : false //save empty value set to false
}));

app.use(passport.initialize());
app.use(passport.session()); //will work with app.session
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({defaultLayout:'index'}));
app.set('view engine', 'handlebars');

const users = [];

app.get ('/shops', notYetAuthenticated, (req, res) => {
    res.render('shops', {name:req.user.name});
});
app.get ('/', notYetAuthenticated, (req, res) => {
    res.render('shops', {name:req.user.name});
});

app.get('/login', alreadyAuthenticated, (req, res) => {
    res.render('login');
});

//we use the passport authentication middleware so we don't need the req and res function
app.post('/login', alreadyAuthenticated, passport.authenticate('local', {
    successRedirect:'/shops',
    failureRedirect:'/login',
    failureFlash:true //no user with that email or password incorrect
}));

app.get('/createAccount', alreadyAuthenticated, (req, res) => {
    res.render('createAccount');
});
app.post('/createAccount', alreadyAuthenticated, async (req, res) => {
    try{
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);
        users.push({
            id : 1,
            email : req.body.email,
            password : hashedPassword
        })
        res.redirect('/login');
    }catch{
        res.redirect('/createAccount');
    }
    //console.log(users);
});

app.delete('/logout', (req, res) => { 
    req.logOut();                  //supported by passport automatically
    res.redirect('/login');         //methode overide was implemented
})

function notYetAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();   
    }else{
        return res.redirect('/login');
    }
}

function alreadyAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/shops');
    }else{
        return next();
    }
}

app.listen(5000);
console.log("Running app...");