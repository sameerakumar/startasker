const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../app/ConfigFiles/config.json');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');

var customerLogin = {
    login: (params, callback) => {
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
        let loginQuery = dbQueries.getCustomerQuery(params);
        loginQuery.then((user) => {
            if (user) {
                var fbpassword = bcrypt.compareSync('startasker', user.password);
                if (fbpassword) {
                    callback({ status: 200, data: { response: statusCodes.failure, message: "You have already logged in from social media so please set your password" } });
                    return;
                }
                var validPassword = bcrypt.compareSync(params.password, user.password);
                if (!validPassword) {
                    callback({ status: 200, data: { response: statusCodes.failure, message: "Login failed, either username/password is wrong" } });
                    return;
                }
                if (user.verification_status === true) {
                    var token = jwt.sign({ id: user.userID }, config.secretkey);                    
                    if (params.deviceType === 'web') {
                        console.log('logged in from web....');
                        let getNotificationQuery = dbQueries.getNotificationsByUserIDQuery(params);
                        getNotificationQuery.then((notifications) => {
                            console.log('notifications length...', notifications.length)
                            if (notifications.length > 0) {
                                var found = false;
                                for (var i = 0; i < notifications[0].devices.web.length; i++) {
                                    if (notifications[0].devices.web[i].deviceToken == params.deviceToken) {
                                        found = true;
                                        // let updateDeviceQuery = dbQueries.updateDeviceIdTokenQuery(params);
                                        // updateDeviceQuery.then((update) => {
                                        //     console.log('updated...', update);
                                        // })
                                        break;
                                    }
                                }
                                console.log('boolean found...', found);
                                if (found === false) {
                                    let updateDeviceByIDQuery = dbQueries.updateDeviceIdTokenByDeviceIdQuery(params, notifications[0]._id);
                                    updateDeviceByIDQuery.then((notifyPushed) => {
                                        console.log('notify pushed...', notifyPushed);
                                    })
                                }
                            } else {
                                let insertDeviceQuery = dbQueries.addingNewDeviceIdTokenQuery(params);
                                insertDeviceQuery.save((success) => {
                                    console.log(success);
                                })
                            }
                        })
                    } else {
                        console.log('logged in from mobile....');
                        let getNotificationQuery = dbQueries.getNotificationsByUserIDQuery(params);
                        getNotificationQuery.then((notifications) => {
                            console.log('notifications length...', notifications.length)
                            if (notifications.length > 0) {
                                console.log(notifications[0].devices.mobile);
                                var found = false
                                for (var i = 0; i < notifications[0].devices.mobile.length; i++) {
                                    if (notifications[0].devices.mobile[i].deviceID == params.deviceID) {
                                        found = true;
                                        let updateDeviceQuery = dbQueries.updateDeviceIdTokenQuery(params);
                                        updateDeviceQuery.then((update) => {
                                            console.log('updated...', update);
                                        })
                                        break;
                                    }
                                }
                                console.log('found value....' + found);
                                if (found === false) {
                                    console.log(notifications[0]._id);
                                    let updateDeviceByIDQuery = dbQueries.updateDeviceIdTokenByDeviceIdQuery(params, notifications[0]._id);
                                    updateDeviceByIDQuery.then((notifyPushed) => {
                                        console.log('notify pushed...', notifyPushed);
                                    })
                                }
                            } else {
                                let insertDeviceQuery = dbQueries.addingNewDeviceIdTokenQuery(params);
                                insertDeviceQuery.save((success) => {
                                    console.log(success);
                                })
                            }
                        })
                    }
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Customer user login success",
                            access_token: token,
                            customerInfo: user
                        }
                    });
                    return;

                } else {
                    callback({ status: 200, data: { response: statusCodes.verificationPending, message: "Customer is registered but verification is pending" } });
                    return;
                }
            } else {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found with us. Please register with us" } });
                return
            }

        }).catch((error) => {
            console.log(error);
        })
    }
}

module.exports = customerLogin;