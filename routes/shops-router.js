const express = require('express');
const router = express.Router();

router.get ('/shops', notYetAuthenticated, (req, res) => {
    res.render('shops', {name:req.user.name});
});

function notYetAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();   
    }else{
        return res.redirect('/login');
    }
}

module.exports = router;