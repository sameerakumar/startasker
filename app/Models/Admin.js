const mongoose = require('mongoose');
let schema = mongoose.Schema;
var AdminSchema = new schema({
    userID:{
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Admin',AdminSchema);