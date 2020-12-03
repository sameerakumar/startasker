const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CouponParamValidations');
const dbQueries = require('./CouponDBQueries');


var updateCoupon = {
    update: (params, callback) => {
        const {error} = paramValidator.validateupdateParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let get_Query = dbQueries.getcouponQuery(params);
        get_Query.then((isFound) => {
            console.log("isfound",isFound)
            if (isFound) {

                let addcardQuery = dbQueries.updateQuery(params,callback);
                addcardQuery.then((Found) => {
                    if (Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Coupon update successfully"
                            }
                        });
                        return;
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Coupon update failed"
                            }
                        });

                    }
                });
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found"
                    }
                });
            }
        })
    }
};

module.exports = updateCoupon;