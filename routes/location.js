const fetch = require('node-fetch');

//USER'S CURRENT LOCATION VARIABLE
var myPosition = {
    longitude: 0,
    latitude: 0
}

//CALCULATES DISTANCE BETWEEN TWO LOCATIONS
function calculateDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344
        return dist;
    }
}

//SORTS AN ARRAY OF SHOPS FROM CLOSEST TO FURTHEST
function sortShops(shop1, shop2) {
    let distanceToShop1 = calculateDistance(
        shop1.latitude, shop1.longitude, myPosition.latitude, myPosition.longitude
    )
    let distanceToShop2 = calculateDistance(
        shop2.latitude, shop2.longitude, myPosition.latitude, myPosition.longitude
    )
    if (distanceToShop1 < distanceToShop2) {
        return -1;
    }
    if (distanceToShop1 > distanceToShop2) {
        return 1;
    }
    return 0;
}

//FETCHES A JSON OF THE COMPUTER'S ESTIMATED LOCATION
function getMyCurrentLocation() {
    fetch('https://ipapi.co/json/')
        .then(function (response) {
            try {
                return response.json();
            } catch (error) {
                console.log(error)
            }
        })
        .then(function (data) {
            try {
                myPosition.longitude = data.longitude
                myPosition.latitude = data.latitude
            } catch (error) {
                console.log(error)
            }
        });
}

module.exports = {
    getMyCurrentLocation,
    sortShops
}