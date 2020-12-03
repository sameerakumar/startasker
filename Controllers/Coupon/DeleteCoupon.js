const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CouponParamValidations');
const dbQueries = require('./CouponDBQueries');


var couponDelete = {

    delete: (params, callback) => {
        const { error } = paramValidator.validateDeleteParams(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return
        }
        let get_Query = dbQueries.getcouponQuery(params);
        get_Query.then((found) => {
            console.log("found",found);
            if(found){

                const deleteQuery = dbQueries.deleteQuery(params,callback);
                deleteQuery.then((deleted) => {
                    if (deleted) {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Coupon has been delete successfully"
                            }
                        });
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Coupon delete has been failed"
                            }
                        });
                    }
                })

            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Coupon found to delete"
                    }
                });
            }
        })
    }
};

module.exports = couponDelete;