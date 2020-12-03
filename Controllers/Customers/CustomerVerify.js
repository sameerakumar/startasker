const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const config = require('../../app/ConfigFiles/config.json');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const jwt = require('jsonwebtoken');

var customerVerify = {
    verify: (params, callback) => {
        const { error } = paramValidations.validateVerifyParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let query = dbQueries.getUserQueryFromUserId(params.userID);
        query.then((user) => {
            if (user) {
                const timeNow = new Date().getTime().toString();
                const otp_time = user.otp_time;
                const timeDifference = timeNow - otp_time;
                console.log(timeDifference);
                if (timeDifference <= 118330.5 && timeDifference > 1) {
                    if (user.otp === params.otp) {
                        var token = jwt.sign({ id: user.userID }, config.secretkey);
                        let updateQuery = dbQueries.prepareUserUpdate(params.userID, true);
                        updateQuery.then((updated_record) => {
                            if (updated_record) {                                
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer verified successfully",
                                        customerInfo: user,
                                        access_token: token
                                    }
                                });
                                return;
                            } else {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer verification failed",
                                        customerInfo: user
                                    }
                                });
                                return;
                            }

                        }).catch((error) => {
                            console.log(error);
                        })
                    } else {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Entered OTP is wrong"
                            }
                        });
                        return;
                    }
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "OTP timed out"
                        }
                    });
                    return;
                }


            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with us. Please register with us."
                    }
                });
                return;
            }
        });
    }
}

module.exports = customerVerify;