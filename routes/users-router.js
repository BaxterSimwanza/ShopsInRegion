const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')

const Users = require('../models/users-model')

router.get('/login', (req, res) => {
    res.render('login')
});

const usersx = require('../models/user-data')

router.post('/login', (req, res, next) => {
    Users.find({ email: req.body.email })
        .exec()
        .then(user => {
            try {
                if (user.length >= 1) {
                    usersx.push(user)
                    console.log('User from Atlas: ' + usersx)
                }
            } catch (error) {
                next(error)
            }
        }).then(() => {
            try {
                res.redirect('/shops')
                next()
            } catch (error) {
                next(error)
            }
        });
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
                            .then(result => {
                                console.log('Account Created ' + result)

                            })
                            .catch(err => console.log(err))
                        res.redirect('/login')
                    }
                } catch (err) {
                    next(err)
                }
            });
    } catch{
        res.redirect('/createAccount')
    }
})

router.delete('/logout', (req, res) => {
    res.redirect('/login')        //methode overide was implemented
})

module.exports = router