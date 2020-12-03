const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const jwt = require('jsonwebtoken');
const config = require('../../app/ConfigFiles/config.json');

var socialMediaLogin = {

    socialMedia: (params, callback) => {
        const { error } = paramValidations.validateSocial_MediaLoginParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        var token = jwt.sign({ id: 'startasker' }, config.secretkey);
        if (params.register_type === 'Facebook') {
            if (params.userID !== '') {
                let getUser = dbQueries.getUserQueryFromUserId(params.userID);
                getUser.then((user_found) => {
                    if (user_found) {
                        if (user_found.register_type === params.register_type || user_found.register_type === 'Manual') {
                            if (user_found.Facebook.facebookID === params.ID) {
                                console.log('fb id matched..');
                                updateDeviceIDTokenID(params);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer login successfully",
                                        tokenID: token,
                                        customerInfo: user_found
                                    }
                                });
                                return;
                            }
                        }
                        let query = dbQueries.getFBCustomerUpdateQuery(params);
                        query.then((update) => {
                            if (update.ok == 1) {
                                updateDeviceIDTokenID(params);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer login successfully",
                                        tokenID: token,
                                        customerInfo: user_found
                                    }
                                });
                                return;
                            }
                        })
                    } else {
                        var signupReferralBy = params.hasOwnProperty('signupReferralBy');
                        if (signupReferralBy) {
                            chkSignupReferralBy = dbQueries.checkReferralsignup(params);
                            chkSignupReferralBy.then((foundData) => {
                                if (foundData) {
                                    params.refferalUserID = foundData.userID;
                                    let insertFBQuery = dbQueries.getFacebookNewCustomerInsertQuery(params, true);
                                    insertFBQuery.save((err) => {
                                        if (err) {
                                            callback({
                                                status: 200,
                                                data: {
                                                    response: statusCodes.failure,
                                                    message: err
                                                }
                                            });
                                            return
                                        }
                                        updateDeviceIDTokenID(params);
                                        callback({
                                            status: 200,
                                            data: {
                                                response: statusCodes.success,
                                                message: "Customer login successfully",
                                                tokenID: token
                                            }
                                        });
                                        return;
                                    })
                                } else {
                                    return callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: "referralCode Not matched"
                                        }
                                    });
                                }
                            })
                        } else {
                            let insertFBQuery = dbQueries.getFacebookNewCustomerInsertQuery(params, true);
                            insertFBQuery.save((err) => {
                                if (err) {
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: err
                                        }
                                    });
                                    return
                                }
                                updateDeviceIDTokenID(params);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer login successfully",
                                        tokenID: token
                                    }
                                });
                                return;
                            })
                        }

                    }
                })
            } else {
                let getUserByFbID = dbQueries.getUserQueryFromUserId(params.ID);
                getUserByFbID.then((found) => {
                    if (found) {
                        if (found.register_type === params.register_type) {
                            if (found.Facebook.facebookID === params.ID) {
                                console.log('fb id matched..');
                                updateDeviceIDTokenID(params);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer login successfully",
                                        tokenID: token,
                                        customerInfo: found
                                    }
                                });
                                return;
                            }
                        }
                    } else {
                        var signupReferralBy = params.hasOwnProperty('signupReferralBy');
                        if (signupReferralBy) {
                            chkSignupReferralBy = dbQueries.checkReferralsignup(params);
                            chkSignupReferralBy.then((foundData) => {
                                if (foundData) {
                                    params.refferalUserID = foundData.userID;
                                    let insertFBQuery = dbQueries.getFacebookNewCustomerInsertQuery(params, true);
                                    insertFBQuery.save((err) => {
                                        if (err) {
                                            callback({
                                                status: 200,
                                                data: {
                                                    response: statusCodes.failure,
                                                    message: err
                                                }
                                            });
                                            return
                                        }
                                        updateDeviceIDTokenID(params);
                                        callback({
                                            status: 200,
                                            data: {
                                                response: statusCodes.success,
                                                message: "Customer login successfully",
                                                tokenID: token
                                            }
                                        });
                                        return;
                                    })
                                } else {
                                    return callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: "referralCode Not matched"
                                        }
                                    });
                                }
                            })
                        } else {
                            let insertFBQuery = dbQueries.getFacebookNewCustomerInsertQuery(params, false);
                            insertFBQuery.save((err) => {
                                if (err) {
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: err
                                        }
                                    });
                                    return
                                }
                                updateDeviceIDTokenID(params);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer login successfully",
                                        tokenID: token
                                    }
                                });
                                return;
                            })
                        }

                    }
                })
            }
        }
        else if (params.register_type === 'Google') {
            let getUser = dbQueries.getUserQueryFromUserId(params.userID);
            getUser.then((user_found) => {
                if (user_found) {
                    if (user_found.register_type === params.register_type || user_found.register_type === 'Manual') {
                        if (user_found.Google.GoogleID === params.ID) {
                            console.log('Google id matched..');
                            updateDeviceIDTokenID(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Customer login successfully",
                                    tokenID: token,
                                    customerInfo: user_found
                                }
                            });
                            return;
                        }
                    }
                    let query = dbQueries.getGoogleCustomerUpdateQuery(params);
                    query.then((update) => {
                        if (update.ok == 1) {
                            updateDeviceIDTokenID(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Customer login successfully",
                                    tokenID: token,
                                    customerInfo: user_found
                                }
                            });
                            return;
                        }
                    })
                } else {
                    var signupReferralBy = params.hasOwnProperty('signupReferralBy');
                    if (signupReferralBy) {
                        chkSignupReferralBy = dbQueries.checkReferralsignup(params);
                        chkSignupReferralBy.then((foundData) => {
                            if (foundData) {
                                params.refferalUserID = foundData.userID;
                                let insertGoogleQuery = dbQueries.getGoogleNewCustomerInsertQuery(params, true);
                                insertGoogleQuery.save((err) => {
                                    if (err) {
                                        callback({
                                            status: 200,
                                            data: {
                                                response: statusCodes.failure,
                                                message: err
                                            }
                                        });
                                        return
                                    }
                                    updateDeviceIDTokenID(params);
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.success,
                                            message: "Customer login successfully",
                                            tokenID: token
                                        }
                                    });
                                    return;
                                })
                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "referralCode Not matched"
                                    }
                                });
                            }
                        })
                    } else {
                        let insertGoogleQuery = dbQueries.getGoogleNewCustomerInsertQuery(params, false);
                        insertGoogleQuery.save((err) => {
                            if (err) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: err
                                    }
                                });
                                return
                            }
                            updateDeviceIDTokenID(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Customer login successfully",
                                    tokenID: token
                                }
                            });
                            return;
                        })
                    }

                }
            })
        }
        else if (params.register_type === 'Apple-signup') {
            let getUser = dbQueries.getAppleCustomerQuery(params);
            getUser.then((user_found) => {
                if (user_found) {
                    if (user_found.register_type === params.register_type || user_found.register_type === 'Manual') {
                        if (user_found.Apple.AppleID === params.ID) {
                            console.log('Apple id matched..');
                            updateDeviceIDTokenID(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Customer login successfully",
                                    tokenID: token,
                                    customerInfo: user_found
                                }
                            });
                            return;
                        }
                    }
                    let query = dbQueries.getAppleCustomerUpdateQuery(params);
                    query.then((update) => {
                        if (update.ok == 1) {
                            updateDeviceIDTokenID(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Customer login successfully",
                                    tokenID: token,
                                    customerInfo: user_found
                                }
                            });
                            return;
                        }
                    })
                } else {
                    var signupReferralBy = params.hasOwnProperty('signupReferralBy');
                    if (signupReferralBy) {
                        chkSignupReferralBy = dbQueries.checkReferralsignup(params);
                        chkSignupReferralBy.then((foundData) => {
                            if (foundData) {
                                params.refferalUserID = foundData.userID;
                                let insertAppleQuery = dbQueries.getAppleNewCustomerInsertQuery(params, true);
                                insertAppleQuery.save((err) => {
                                    if (err) {
                                        callback({
                                            status: 200,
                                            data: {
                                                response: statusCodes.failure,
                                                message: err
                                            }
                                        });
                                        return
                                    }
                                    updateDeviceIDTokenID(params);
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.success,
                                            message: "Customer login successfully",
                                            tokenID: token
                                        }
                                    });
                                    return;
                                })
                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "referralCode Not matched"
                                    }
                                });
                            }
                        })
                    } else {
                        let insertAppleQuery = dbQueries.getAppleNewCustomerInsertQuery(params, false);
                        insertAppleQuery.save((err) => {
                            if (err) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: err
                                    }
                                });
                                return
                            }
                            updateDeviceIDTokenID(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Customer login successfully",
                                    tokenID: token
                                }
                            });
                            return;
                        })
                    }

                }
            })

        } else if (params.register_type === 'Apple-signin') {
            // check user with apple userID. if there then send the login respo        
            let getUser = dbQueries.getAppleCustomerQuery(params);
            getUser.then((user_found) => {
                if (user_found) {
                    params.userID = user_found.userID;
                    if (user_found.Apple.AppleID === params.ID) {
                        console.log('Apple id matched..');
                        updateDeviceIDTokenID(params);
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Customer login successfully",
                                tokenID: token,
                                customerInfo: user_found
                            }
                        });
                        return;
                    } else {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.verificationPending,
                                message: "Apple user not found"
                            }
                        });
                        return;
                    }
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.verificationPending,
                            message: "Apple user not found"
                        }
                    });
                    return;
                }
            })
        }

    }
}

function updateDeviceIDTokenID(params) {
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
    return;
}

module.exports = socialMediaLogin;