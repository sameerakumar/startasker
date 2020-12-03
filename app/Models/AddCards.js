const mongoose = require('mongoose');
let schema = mongoose.Schema;
var CardSchema = new schema({
    userID: {
        required: true,
        type: String,
        unique: true
    },
   cards:[{
       cardNumber: {
           type: String,
           required: true
       },
       cardholderName: {
           type: String,
           required: true
       },
       expiryDate: {
           type: String,
           required: true
       }
}],
    timestamp: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('AddCard',CardSchema);