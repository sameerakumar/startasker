const  paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');
const  statusCodes = require('../Core/StatusCodes');
const  statusMessages = require('../Core/StatusMessages');
const bcrypt = require('bcryptjs');
const config = require('../../app/ConfigFiles/config.json');
const jwt=require('jsonwebtoken');


var adminLogin = {
    login: (params, callback) => {
        const {error} = paramValidator.validateLoginParams(params);
        if (error) {
            return callback({
                status: 400,

                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }

        let query = dbQueries.getQuery(params);
        query.then((user) => {
            console.log("Find User" + user);
            if (user) {
                var token = jwt.sign({  }, config.secretkey);
                var passwordIsValid = bcrypt.compareSync(params.password, user.password);
                console.log("password", bcrypt.compareSync(params.password, user.password));
                if (passwordIsValid) {
					return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Admin Login success",
                            access_token: token
                        }
                    });
                } else {                    
					return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Admin_invalid_credentials"

                        }
                    });
                }
            } else {
                callback({
                    status: 200,
                    data: {response: statusCodes.failure, message: "No data found with us. Please register with us"}
                });
                return
            }

        });
    }


}

module.exports = adminLogin;