const CouponInsert = require('./InsertCoupon');
const CouponUpdate = require('./UpdateCoupon');
const CouponFetch = require('./FetchCoupon');
const CouponDelete = require('./DeleteCoupon');


var Coupon = {

    insert: (params, callback) => {
        return CouponInsert.coupon(params, callback);
    },
    update:(params, callback) => {
        return CouponUpdate.update(params, callback);
    },
    fetch: (params,callback) => {
        return CouponFetch.fetch(params,callback);
    },
    delete:(params, callback) => {
        return CouponDelete.delete(params, callback);
    }
};
module.exports = Coupon;