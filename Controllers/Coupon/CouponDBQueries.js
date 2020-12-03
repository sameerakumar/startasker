const Coupon = require('../../app/Models/Coupons');

var CouponDBQueries = {
    getcouponQuery: (params) => {
        var query = {
            $or: [{
                couponID: {$regex: '^' + params.couponID + '$', $options: 'i'}
            }
            ]
        }
        return Coupon.findOne(query, {_id: 0, __v: 0}).exec()

    },
    insertQuery: (params) => {
        const timestamp = new Date().getTime().toString();
        let coupon = new Coupon({
            timestamp: timestamp,
            couponID: params.couponID,
            couponCode: params.couponCode,
            expiryData : params.expiryData,
            couponAmount: params.couponAmount
        });
        return coupon;
    },
   updateQuery: (params) => {
        return Coupon.updateOne({ couponID: new RegExp(params.couponID, 'i') }, {
            $set: {
                couponCode: params.couponCode
            }
        }).exec()
    },
    FetchQuery: () => {
        return Coupon.find({}, {_id: 0, __v: 0}).exec()
    },
    deleteQuery:(params,callback)=>{
        return Coupon.deleteOne({ couponID: new RegExp(params.couponID + '$') }).exec()

    },
}
    module.exports = CouponDBQueries;