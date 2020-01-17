const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required:true},
    imageLink: {type: String, required:true},
    longitude:{type: Number},
    latitude:{type: Number}
});

module.exports = mongoose.model('Shops', shopSchema);