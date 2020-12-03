const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');
const bcrypt = require('bcryptjs');


var admin = {
    insert: (params, callback) => {
        const { error } = paramValidator.validateParams(params);
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
        let adminQuery = dbQueries.insertQuery(params);
        adminQuery.save((Found) => {
            if (!Found) {
                let adminInboxCreateQuery = dbQueries.insertAdminInboxQuery(params.userID);
                adminInboxCreateQuery.save((saved)=>{
                    console.log('saved data...',saved);
                })
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Admindata Insert successfully"
                    }
                });
                return;
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Admindata Insert failed"
                    }
                });

            }
        });

    }
};

module.exports = admin;