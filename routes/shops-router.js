const express = require('express');
const router = express.Router();

router.get ('/shops' , (req, res) => {
    res.render('shops');
});

module.exports = router;