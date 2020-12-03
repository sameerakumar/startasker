const dbQueries =  require('./CouponDBQueries');
const statusCodes = require('../Core/StatusCodes');
var FetchCoupons = {

    fetch: (callback) => {
        let getQuery = dbQueries.FetchQuery();
        getQuery.then((find) =>{
            callback({ status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Coupon fetched successfully" ,
                    Coupon: find
                } });
            return;
        })
    }

}

module.exports = FetchCoupons;