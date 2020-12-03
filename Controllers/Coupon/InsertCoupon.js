const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CouponParamValidations');
const dbQueries = require('./CouponDBQueries');


var addCoupon = {
    coupon: (params, callback) => {
        const {error} = paramValidator.validateinsertParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }

                let CouponQuery = dbQueries.insertQuery(params);
                CouponQuery.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Coupon Insert successfully"
                            }
                        });
                        return;
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Coupon Insert failed"
                            }
                        });

                    }
                });
    }
};

module.exports = addCoupon;