const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');
const Notificationcustomer = require('../Core/AccountVerificationNotificationsToCustomers');
const Mailer = require('../Core/Mailer');

var userUpdate = {
    updatedata: (params, callback) => {
        const {error} = paramValidator.UpdateParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let user_get_Query = dbQueries.FetchQuery(params.userID);
        user_get_Query.then((isFound) => {
            if (isFound) {
                var status = params.isVerified;
                console.log("check..", "Verified" === params.isVerified)
                if ("Verified" === params.isVerified) {
                    let updateQuery = dbQueries.UpdateQuery(params, status);
                    updateQuery.then((isUpdate) => {
                        let updateQuery = dbQueries.AccountVerificationUpdateQuery(params, status);
                        updateQuery.then((isUpdate) => {
                            if (isUpdate) {
                                var data =   {
                                    notification:{
                                        "title": "Account Verification" ,
                                        "body": "Admin has been verified your account",
                                        "sound": "default",
                                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                        "click_action": "https://www.startasker.com/#/profile/" + params.userID
                                    },
                                    data: {
                                        "userID": params.userID,
										"profilePic": isFound.profilePic,
                                        "type":"AccountVerification",
										"completedTo":"Customer"
                                    }
                                }                                
                                Notificationcustomer.admintransactionalNotificationscustomer(params.userID, isFound.firstName,data,"",true);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Account Verified successfully"
                                    }
                                });
                                return;
                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "Account Verified failed"
                                    }
                                });
                            }
                        })
                    });
                } else {
                    let updateQuery = dbQueries.UpdateQuery(params, status);
                    updateQuery.then((isUpdate) => {
                        let updateQuery = dbQueries.AccountVerificationRejectedQuery(params, status);
                        updateQuery.then((isUpdate) => {
                            if (isUpdate) {
                                var data =   {
                                    notification:{
                                        "title": "Account Verification" ,
                                        "body": "Admin has been rejected your account",
                                        "sound": "default",
                                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                        "click_action": "https://www.startasker.com/#/profile/" + params.userID
                                    },
                                    data: {
                                        "userID": params.userID,
										"profilePic": isFound.profilePic,
                                        "type":"AccountVerification",
										"completedTo":"Customer",										
                                        "reason":params.reason
                                    }
                                }                               
                                Notificationcustomer.admintransactionalNotificationscustomer(params.userID, isFound.firstName,data,params.reason,false);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Account Verified successfully",
                                        reason: params.reason
                                    }
                                });
                                return;
                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "Account Verified failed"
                                    }
                                });
                            }
                        })
                    });
                }
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


module.exports = userUpdate;