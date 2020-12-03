const mongoose = require('mongoose');
let schema = mongoose.Schema;
let ReviewSchema = new schema({

    postID:{
        type: String,
        required: true
    },
    ratingsGivenBy:{
        userID:{
            type:String,
            required:false
        },
        name:{
            type:String,
            required:false
        },
        profilePic:{
            type:String,
            required:false
        }

    },
    ratingsGivenTo:{
        userID:{
            type:String,
            required:false
        },
        name:{
            type:String,
            required:false
        },
        profilePic:{
            type:String,
            required:false
        }
    },
    ratingsAsAProvider:{
        type:String,
        required:false
    },
    ratingsAsAPoster:{
        type:String,
        required:false
    },
    bookingID:{
        type:String,
        required:false
    },
    body:{
        type:String,
        required:false
    },
    postTitle:{
        type:String,
        required: false
    },
    timestamp: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('Review',ReviewSchema);