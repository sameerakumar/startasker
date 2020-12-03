const mongoose = require('mongoose');
let schema = mongoose.Schema;
let TaskSchema = new schema({

    userID:{
        type: String,
        required: true
    },
    type:{
        type:String,
        require: false
    },
    message:{
        type:Number,
        required:false
    },
    timestamp: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Task',TaskSchema);