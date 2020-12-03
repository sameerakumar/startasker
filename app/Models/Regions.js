const mongoose = require('mongoose');
let schema = mongoose.Schema;
var RegionsSchema = new schema({

    regionId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    regionStatus: {
        type: String,
        default: 'active'
    },
    timeStamp: {
        type: String,
        required: true
    }

    
});
module.exports = mongoose.model('Regions',RegionsSchema);