const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

var Shops = require('../models/shops-model')
const Users = require('../models/users-model')
var userData = require('../models/user-data')
var shopsData = require('../models/shops-data')

var myPosition = {
    longitude: 0,
    latitude: 0
}

function calculateDistance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}else{
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344
		return dist;
	}
}

function sortShops(shop1, shop2){
    let distanceToShop1 = calculateDistance(
      shop1.latitude,shop1.longitude,myPosition.latitude,myPosition.longitude
      )
    let distanceToShop2 = calculateDistance(
      shop2.latitude,shop2.longitude,myPosition.latitude,myPosition.longitude
      )
    if(distanceToShop1 < distanceToShop2){
        return -1;
    }
    if(distanceToShop1 > distanceToShop2){
        return 1;
    }
    return 0;
}

function getMyCurrentLocation(){
    fetch('https://ipapi.co/json/')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            myPosition.longitude = data.longitude
            myPosition.latitude = data.latitude
        });
}

router.get('/nearbyFilteredShops', (req, res, next) => {
    
    shopsData = []
    try {

        Shops.find({                                                   //Find all except liked and disliked shops
            $or:
                [
                    { title: { $nin: userData[0].likedShopsId.concat(userData[0].dislikedShopsId) } }
                ]
        })
            .exec()
            .then(allShops => {
                try {
                    if (allShops.length >= 1) {                        //If we have shops in the region

                        getMyCurrentLocation()

                        allShops.forEach(shop => {
                            let { title, imageLink, longitude, latitude } = shop;
                            shopsData.push({ title: title, imageLink: imageLink, longitude: longitude, latitude: latitude });
                        })
                    } else {
                        console.log("No shops to display!")
                    }
                } catch (err) {
                    next(err)
                }
            }).then(() => {
                try {
                    shopsData.sort(sortShops)
                    res.redirect('/nearbyShops');
                    next()
                } catch (error) {
                    next(error)
                }
            });
    } catch (error) {
        next(error)
    }
});

router.get('/nearbyShops', (req, res) => {
    res.render('nearbyShops', { shopsData: shopsData });
});

router.get('/preferredShops', (req, res) => {
    getMyCurrentLocation()
    res.render('preferredShops');
});

router.post('/likeShop', (req, res, next) => {
    userData[0].likedShopsId.push(req.body.title)
    Users.findOneAndUpdate({ _id: userData[0]._id },
        {
            likedShopsId: userData[0].likedShopsId
        }
    ).exec()
        .then(() => {
            try {
                res.redirect('/nearbyFilteredShops')
                next()
            } catch (error) {
                next(error)
            }
        });
})

router.post('/disLikeShop', (req, res, next) => {

    userData[0].dislikedShopsId.push(req.body.title) 

    setTimeout(foo, 10000);

    Users.findOneAndUpdate({ _id: userData[0]._id },
        {
            dislikedShopsId: userData[0].dislikedShopsId
        })
        .exec()
        .then(() => {
            try {
                res.redirect('/nearbyFilteredShops')
                next()
            } catch (error) {
                next(error)
            }
        });
})

module.exports = router;


  