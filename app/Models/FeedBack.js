const mongoose = require('mongoose');
let schema = mongoose.Schema;
let FeedBackSchema = new schema({

    userID:{
        type: String,
        required: true
    },
    reviewMessage:{
        type:String,
        require: false
    },
    RatethisApp:{
        type:Number,
        required:false
    }
});
module.exports = mongoose.model('FeedBacks',FeedBackSchema);