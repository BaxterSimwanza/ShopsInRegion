const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

const Users = require('../models/mongooseSchema/users-model')
var userData = require('../data/user-data')

//LOGOUT
router.delete('/logout', (req, res) => {
    userData.splice(0, 1)
    res.redirect('/login')
})

//LOGIN PAGE
router.get('/', (req, res, next) => {
    res.redirect('/login')
    next()
});
router.get('/login', (req, res) => {
    res.render('login')
});

//CREATE ACCOUNT PAGE
router.get('/createAccount', (req, res) => {
    res.render('createAccount')
});

//LOGIN WITH INPUT CREDENTIALS
router.post('/login', (req, res, next) => {
    try {
        Users.find({ email: req.body.email })
            .exec()
            .then(async user => {
                if (user.length >= 1) {
                    userData.splice(0, 1)
                    userData.push(user[0])
                    if (await bcryptjs.compare(req.body.password, userData[0].password)) {
                        res.redirect('/filterNearbyShops')
                        next()
                    } else {
                        res.redirect('/login')
                        next()
                    }
                } else {
                    res.redirect('/login')
                    next()
                }
            });
    } catch (error) {
        next(error)
    }
});

//CREATE ACCOUNT WITH INPUT CREDENTIAL
router.post('/createAccount', (req, res, next) => {
    try {
        Users.find({ email: req.body.email })
            .exec()
            .then(async user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "User with that email already exists!"
                    })
                } else {
                    const hashedPassword = await bcryptjs.hash(req.body.password, 10)
                    const newUser = new Users({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hashedPassword
                    });
                    newUser
                        .save()
                        .then(() => {
                            res.redirect('/login')
                        })
                }
            });
    } catch (error) {
        next(error)
        res.redirect('/createAccount')
    }
})

module.exports = router