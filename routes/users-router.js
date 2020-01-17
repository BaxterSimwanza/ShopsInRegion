const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

const Users = require('../models/users-model')
var userData = require('../models/user-data')

router.get('/', (req, res, next) => {
    res.redirect('/login')
    next()
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', (req, res, next) => {
    try {
        Users.find({ email: req.body.email })
            .exec()
            .then(async user => {
                try {
                    if (user.length >= 1) {                               //If a user with this email exists, return his info and save it in memory

                        userData.push(user[0])

                        if (await bcryptjs.compare(req.body.password, userData[0].password)) {   //If the hashed input password matches the database
                            res.redirect('/nearbyFilteredShops')
                            next()
                        } else {                                          //Password mismatch
                            res.redirect('/login')
                            next()
                        }
                    } else {                                              //No user with that email in database
                        res.redirect('/login')
                        next()
                    }
                } catch (error) {
                    next(error)
                }
            });
    } catch (error) {
        next(error)
    }
});

router.get('/createAccount', (req, res) => {
    res.render('createAccount')
});

router.post('/createAccount', (req, res) => {
    try {
        Users.find({ email: req.body.email })
            .exec()
            .then(async user => {
                try {
                    if (user.length >= 1) {                         //If this email already exists in the database
                        return res.status(409).json({
                            message: "User with that email already exists!"
                        })
                    } else {                                        //Create hash the password and create a new user
                        const hashedPassword = await bcryptjs.hash(req.body.password, 10)
                        const newUser = new Users({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hashedPassword
                        });
                        newUser
                            .save()
                            .then(() => {
                                try {
                                    res.redirect('/login')          //If new user is created successfully, redirect to the login page
                                } catch (error) {
                                    next(error)
                                }
                            })
                    }
                } catch (err) {
                    next(err)
                }
            });
    } catch{
        res.redirect('/createAccount')
    }
})

router.delete('/logout', (req, res) => {                            //Logout from application
    res.redirect('/login')
})

module.exports = router