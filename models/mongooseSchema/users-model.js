const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required:true},
    password: {type: String, required:true},
    likedShopsId:[{
        type: String
    }],
    dislikedShopsId:[{
        type: String
    }]
});

module.exports = mongoose.model('Users', userSchema);