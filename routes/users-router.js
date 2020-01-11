const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

const passport = require('../index');

router.get('/login', alreadyAuthenticated, (req, res) => {
    res.render('login');
});

//we use the passport authentication middleware so we don't need the req and res function
router.post('/login', alreadyAuthenticated, passport.authenticate('local', {       //export passport will fix this
    successRedirect:'/shops',
    failureRedirect:'/login',
    failureFlash:true //no user with that email or password incorrect
}));

router.get('/createAccount', alreadyAuthenticated, (req, res) => {
    res.render('createAccount');
});

const users = require('../models/users-model');
router.post('/createAccount', alreadyAuthenticated, async (req, res) => {
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
});

router.delete('/logout', (req, res) => { 
    req.logOut();                  //supported by passport automatically
    res.redirect('/login');        //methode overide was implemented
})

function alreadyAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/shops');
    }else{
        return next();
    }
}

module.exports = router;