const mongoose = require('mongoose');
let schema = mongoose.Schema;
var CouponSchema = new schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    coupones: {
        type: Array,
        required: true,
        default: []
    }


});
module.exports = mongoose.model('Coupon', CouponSchema);