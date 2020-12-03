const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');
const bcrypt = require('bcryptjs');

var admin = {
    update: (params, callback) => {
        const { error } = paramValidator.validateLoginParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let hashedPassword = bcrypt.hashSync(params.password);
        params.password = hashedPassword;
        let adminQuery = dbQueries.adminPasswordUpdate(params);
        adminQuery.then((Found) => {
            if (Found) {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Admindata Update successfully"
                    }
                });
                return;
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Admindata Update failed"
                    }
                });

            }
        });

    }
};

module.exports = admin;