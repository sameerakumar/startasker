const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const bcrypt = require('bcryptjs');

var resetCustomerPassword = {
    restpassword: (params, callback) => {
        const { error } = paramValidations.validateLoginParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }

        let resetQuery = dbQueries.getCustomerQuery(params);
        resetQuery.then((user) => {
            if(user){
                var oldPasswordMatch = bcrypt.compareSync(params.password, user.password);
                if (!oldPasswordMatch) {
                let hashedPassword = bcrypt.hashSync(params.password, 8);
                let updateQuery = dbQueries.getUpdateForResetPassword(user.userID, hashedPassword);
                updateQuery.then((updated_record) => {
                    if (updated_record.ok == 1) {
                            return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Reset password successfully"
                            }
                        });
                    }
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Reset password failed"
                        }
                    });
                })
                }else{
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "New password taken before"
                        }
                    });
                }
            }else{
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            }
        })
    }
}

module.exports = resetCustomerPassword;