const mongoose = require('mongoose');
let schema = mongoose.Schema;
var AdminInbox = new schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    sentInbox: {
        type: Array,
        required:false,
        default: []
    },
    recievedInbox:{
        type: Array,
        required: false,
        default:[]
    }
    
});
module.exports = mongoose.model('AdminInbox',AdminInbox);