if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require ('express');
const exphbs = require('express-handlebars');
const app = express();

const flash = require('express-flash');
const session = require('express-session');

const methodOverride = require('method-override');

const passport = require('passport');
const initializePassport = require('./configurations/passport-config');
const users = require('./models/users-model');

initializePassport(
    passport,                                          //passport configuration
    email => users.find(user => user.email === email),//finding a user based on the email
    id =>  users.find(user => user.id === id)
);

app.use(express.static('public')); //FINE
app.use(express.urlencoded({ extended : false })); //FINE

app.use(flash()); //flash messages fine
app.use(session({ //sessions fine
    secret : process.env.SESSION_SECTRET, //secret
    resave : false, //should we resave session values if nothing has changed
    saveUninitialized : false //save empty value set to false
}));

app.use(passport.initialize());
app.use(passport.session()); //will work with app.session
app.use(methodOverride('_method')); //FOR DELETE

app.engine('handlebars', exphbs({defaultLayout:'index'}));
app.set('view engine', 'handlebars');
module.exports = passport;

app.use('/', require('./routes/shops-router'));
app.use('/', require('./routes/users-router'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', ()=>console.log("Running server..."));