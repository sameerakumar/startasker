const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');
const Notifications = require('../Core/AdminPaymentReleaseNotifications');
const { param } = require('../../routes/Customer');

var paymentStatus = {
    status: (params, callback) => {
        const { error } = paramValidator.paymentAdminparams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchQuery = dbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchQuery.then((ifFound) => {
            if (ifFound) {
                var providerarray = ifFound.bookedTaskers;
                var found = false;
                for (var i = 0; i < providerarray.length; i++) {
                    var offeruserid = providerarray[i].offeredUserID;
                    if (offeruserid == params.offeredUserID) {
                        found = true;
                        params.offeredUserProfilePic = providerarray[i].offeredUserProfilePic;
                        params.offeredUserName = providerarray[i].offeredUserName;
                        let netBudget = providerarray[i].budget - ((providerarray[i].budget * 20) / 100);
                        params.Amount = netBudget;
                        let updateDeviceQuery = dbQueries.getUpdateQuery(params);
                        updateDeviceQuery.then((update) => {
                            var data11 = {
                                notification: {
                                    "title": "StarTasker",
                                    "body": " Admin realesed payment to provider for the task " + ifFound.taskTitle,
                                    "sound": "default",
                                },
                                data: {
                                    "profilePic": params.offeredUserProfilePic,
                                    "userID": params.offeredUserID,
                                    "postID": ifFound.postID,
                                    "bookingID": ifFound.bookingID,
                                    "type": "AdminPaymentDoneToProvider",
                                    "completedTo":"Poster"
                                }
                            }
                            Notifications.admintransactionalNotifications(ifFound.userID, data11,params,ifFound,true);
                            var data = {
                                notification: {
                                    "title": "StarTasker",
                                    "body": " Admin released payment for your completed task " + ifFound.taskTitle,
                                    "sound": "default",
                                },
                                data: {

                                    "profilePic": ifFound.customerProfilePic,
                                    "userID": ifFound.userID,
                                    "postID": ifFound.postID,
                                    "bookingID": ifFound.bookingID,
                                    "type": "AdminPaymentDoneToProvider",
                                    "completedTo":"Provider"
                                }
                            }
                            //Mailer.admintransactionalNotificationsprovider("provider", ifFound.userID)
                            Notifications.admintransactionalNotifications(params.offeredUserID, data,params,ifFound,false);
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "payment status updated successfully..",
                                }
                            });

                        });
                        break;
                    }
                }
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Found Data"
                    }
                });
            }
        })
    }

}
module.exports = paymentStatus;