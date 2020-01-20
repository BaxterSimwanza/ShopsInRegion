const express = require('express');
const router = express.Router();
var locationFunctions = require("./location")

var Shops = require('../models/mongooseSchema/shops-model')
const Users = require('../models/mongooseSchema/users-model')

var userData = require('../data/user-data')
var shopsData = []
var likedShopsData = []
var dislikedShopsArray = []

//FILTERS NEARBY SHOPS THAT ARE NEITHER LIKED NOR DISLIKED BY THE CURRENT USE
router.get('/filterNearbyShops', (req, res, next) => {
    try {
        shopsData = []
        Shops.find({
            $or:
                [
                    { shopId: { $nin: userData[0].likedShopsId.concat(userData[0].dislikedShopsId) } }
                ]
        }).exec()
            .then(allShops => {
                if (allShops.length >= 1) {
                    allShops.forEach(shop => {
                        let { shopId, shopName, imageLink, longitude, latitude } = shop
                        shopsData.push({ shopId: shopId, shopName: shopName, imageLink: imageLink, longitude: longitude, latitude: latitude })
                    })
                } else {
                    console.log("No shops to display!")
                }
            }).then(() => {
                res.redirect('/nearbyShops');
                next()
            });
    } catch (error) {
        next(error)
    }
});

//SORTS THE SHOPSDATA ARRAY AND RENDERS THE NEARBYSHOPS PAGE
router.get('/nearbyShops', (req, res) => {
    locationFunctions.getMyCurrentLocation()
    shopsData.sort(locationFunctions.sortShops)

    res.render('nearbyShops', { shopsData: shopsData });
});

//GETS THE AUTHENTICATED USER'S LIKED SHOPS AND RENDERS THE PREFERRED SHOPS 
router.get('/preferredShops', (req, res, next) => {
    try {
        likedShopsData = []
        Shops.find({
            $or:
                [
                    { shopId: { $in: userData[0].likedShopsId } }
                ]
        }).exec()
            .then(allShops => {
                if (allShops.length >= 1) {
                    allShops.forEach(shop => {
                        let { shopId, shopName, imageLink, longitude, latitude } = shop;
                        likedShopsData.push({
                            shopId: shopId,
                            shopName: shopName,
                            imageLink: imageLink,
                            longitude: longitude,
                            latitude: latitude
                        });
                    })
                } else {
                    console.log("No shops to display!")
                }
            }).then(() => {
                locationFunctions.getMyCurrentLocation()
                likedShopsData.sort(locationFunctions.sortShops)
                res.render('preferredShops', { likedShopsData: likedShopsData });
            });
    } catch (error) {
        next(error)
    }
});

//REMOVES A SHOP FROM THE CURRENT USER'S LIKEDSHOPSID ARRAY
router.post('/removeFromPreferredShops', (req, res, next) => {
    userData[0].likedShopsId = userData[0].likedShopsId.filter(likedShopsId => likedShopsId !== req.body.shopId)
    Users.findOneAndUpdate({ _id: userData[0]._id },
        {
            likedShopsId: userData[0].likedShopsId
        }
    ).exec()
        .then(() => {
            try {
                res.redirect('/preferredShops')
                next()
            } catch (error) {
                next(error)
            }
        });
})

//ADDS SHOP TO CURRENT USER'S LIKEDSHOPSID ARRAY
router.post('/likeShop', (req, res, next) => {
    userData[0].likedShopsId.push(req.body.shopId)
    
    Users.findOneAndUpdate({ _id: userData[0]._id },
        {
            likedShopsId: userData[0].likedShopsId
        }
    ).exec()
        .then(() => {
            try {
                res.redirect('/filterNearbyShops')
                next()
            } catch (error) {
                next(error)
            }
        });
})

//ADDS SHOP TO CURRENT USER'S DISLIKEDSHOPSID ARRAY AND THEN REMOVES IT AFTER 10 SECONDS
router.post('/disLikeShop', (req, res, next) => {
    userData[0].dislikedShopsId.push(req.body.shopId)

    setTimeout(function putBackData() {
        shopsData.push(dislikedShopsArray[0])
        dislikedShopsArray.splice(0, 1)
        userData[0].dislikedShopsId = userData[0].dislikedShopsId.filter(dislikedShopsId => dislikedShopsId !== req.body.shopId)
        Users.findOneAndUpdate({ _id: userData[0]._id },
            {
                dislikedShopsId: userData[0].dislikedShopsId
            })
            .exec();
    }, 10000);

    dislikedShopsArray.push(shopsData.filter(shopsData => shopsData.shopId === req.body.shopId)[0])
    Users.findOneAndUpdate({ _id: userData[0]._id },
        {
            dislikedShopsId: userData[0].dislikedShopsId
        })
        .exec()
        .then(() => {
            try {
                res.redirect('/filterNearbyShops')
                next()
            } catch (error) {
                next(error)
            }
        });
})

module.exports = router;