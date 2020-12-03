const mongoose = require('mongoose');
let schema = mongoose.Schema;
let ShareFeedBackSchema = new schema({

    userID:{
        type: String,
        required: true,
        unique: true
    },
    userName:{
        type: String,
        required: false
    },
    profilePic:{
        type: String,
        required: false
    },
    ratings:{
        type: String,
        required: false
    },
    ratingOptions:{
        type:Array,
        required:false
    },
    body:{
        type:Array,
        required:false
    },
    timestamp: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('ShareFeedback',ShareFeedBackSchema);