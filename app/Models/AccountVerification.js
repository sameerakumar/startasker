const mongoose = require('mongoose');
let schema = mongoose.Schema;
var AccountSchema = new schema({   
    firstName: {
        required: false,
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        required: false,
        default: ''
    },
    Nationality: {
        required: false,
        type: String,
        default: ''
    },
    IDType: {
        type: String,
        required: false,
        default: ''
    },
    phoneNumber: {
        type: String,
        required: false,
        default: ''
    },
    userID: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: false,
        default: ''
    },
    IDPhoto: {
        type: String,
        required: false,
        default: ''
    },
    profilePhoto: {
        type: String,
        required: false,
        default: ''
    },
    DOB: {
        type: String,
        required: false,
        default: ''
    },
    Address: {
        type: String,
        required: false,
        default: ''
    },
    PostCode: {
        type: String,
        required: false,
        default: ''
    },
    City: {
        type: String,
        required: false,
        default: ''
    },
    State: {
        type: String,
        required: false,
        default: ''
    },
    CountryRegion: {
        type: String,
        required: false,
        default: ''
    },
    timestamp: {
        type: String,
        required: false,
        default: ''
    },
    isVerified: {
        type: String,
        required: true,
        default: 'Unverified'
    },
    reason: {
        type: String,
        required: false,
        default: ''
    }
});
module.exports = mongoose.model('AccountVerification', AccountSchema);