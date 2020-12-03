const mongoose = require('mongoose');
let schema = mongoose.Schema;
var customerFeedBackSchema = new schema({
    bookingID: {
        required: true,
        type: String
    },
    customerID: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    taskerID : {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('CustomerFeedBacks',customerFeedBackSchema);