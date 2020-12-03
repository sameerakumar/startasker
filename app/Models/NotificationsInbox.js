const mongoose = require('mongoose');
let schema = mongoose.Schema;
var NotificationInboxSchema = new schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    notifyInbox: {
        type: Array,
        required:true,
        default: []
    },
    messageInbox:{
        type: Array,
        required: false,
        default:[]
    }
    
});
module.exports = mongoose.model('NotificationInbox',NotificationInboxSchema);