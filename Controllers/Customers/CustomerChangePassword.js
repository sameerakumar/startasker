const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const bcrypt = require('bcryptjs');
const dbQueries = require('./CustomerDBQueries');
const paramValidator = require('./CustomerParamsValidation');

var customerChangePassword = {
    changePassword: (params, callback) => {
        const { error } = paramValidator.validateChangePasswordParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let query = dbQueries.getCustomerQuery(params);
        query.then((user) => {
            if (user) {
                var oldPasswordMatch = bcrypt.compareSync(params.oldPassword, user.password);
                if (oldPasswordMatch) {
                    var newPasswordMatch = bcrypt.compareSync(params.newPassword, user.password);
                    if (!newPasswordMatch) {
                        let hashedPassword = bcrypt.hashSync(params.newPassword, 8);
                        let updateQuery = dbQueries.getUpdateForResetPassword(user.userID, hashedPassword);
                        updateQuery.then((updated_record) => {
                            if (updated_record.ok == 1) {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer has been changed password successfully"
                                    }
                                });
                            }
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Customer password changing failed"
                                }
                            });
                        });

                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Customer new password already taken before"
                            }
                        });
                    }
                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Customer provided old password wrong"
                        }
                    });
                }
            }
            else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found. Please register with us"
                    }
                });
            }
        });
    }

}
module.exports = customerChangePassword;