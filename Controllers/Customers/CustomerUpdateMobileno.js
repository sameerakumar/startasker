const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const GenerateOTP = require('../Core/GenerateOTP');


var customerUpdateMobileno = {
    mobilenoupdate: (params, callback) => {
        const { error } = paramValidator.UpdateMobilenoParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let get_Query = dbQueries.getUserQueryFromUserId(params.userID);
        get_Query.then((isFound) => {
            if (isFound) {
                console.log("isfound", isFound);
                let updateQuery = dbQueries.customerMobilenoUpdateQuery(params);
                updateQuery.then((isUpdate) => {
                    if (isUpdate) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Customer mobile number update successfully"

                            }
                        });
                        return;
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Customer mobile number update failed"
                            }
                        });

                    }
                });
            }
            else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with us"
                    }
                });
                return;
            }

        });
    }
}


module.exports = customerUpdateMobileno;