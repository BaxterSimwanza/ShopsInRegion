const express = require('express');
const router = express.Router();

router.get ('/nearbyShops' , (req, res) => {
    res.render('nearbyShops');
});

router.get ('/preferredShops' , (req, res) => {
    res.render('preferredShops');
});



module.exports = router;