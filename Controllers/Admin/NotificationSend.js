const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');
const sendMultipleNotifications = require('../Core/SendMultipleNotifications');

var notificationsSend = {
    SendNotificationToEmails: (params, callback) => {
        const { error } = paramValidator.validateSendNotificationParams(params);
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
        query.then((found) => {
            if (found) {
                var data = {
                    notification: {
                        "title": params.title,
                        "body": params.Content,
                        "sound": "default",
                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                        "click_action":  "https://www.startasker.com/#/my-account/inbox"
                    },
                    data: {
                        "profilePic": "/startasker-new-logo2-1.png",
                        "type": "AdminOffers"
                    }
                } 
                sendMultipleNotificationsToUsers(params,data,callback);
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No admin data found. Please pass correct adminId"
                    }
                });
            }
        })

    },
    fetchAdminNotifications: (params, callback) => {
        const { error } = paramValidator.validateGetAdminByUserID(params);
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
        query.then((found) => {
            if (found) {
                let fetchAdminNotificationQuery = dbQueries.getAdminNotifications(params);
                fetchAdminNotificationQuery.then((foundInbox) => {
                    //console.log('db fetch admin inbox...', foundInbox);
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Admin notifications fetched successfully",
                            notificationData: foundInbox
                        }
                    });
                })
            }
            else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No admin data found. Please pass correct adminId"
                    }
                });
            }
        })
    },
    fetchFilteredCustomers: (params, callback) => {
        const { error } = paramValidator.validateFetchCustomerUserIDsParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchCustomerUserIDsQuery = dbQueries.fetchCustomersBasedOnFilters(params);
        fetchCustomerUserIDsQuery.then((foundCustomers) => {
            if (foundCustomers) {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Customers fetched successfully",
                        customersData: Object.assign({}, ...foundCustomers)
                    }
                });
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Customers fetched failed"
                    }
                });
            }
        })
    },
    deleteAdminNotification: (params, callback) => {
        const { error } = paramValidator.validateDeleteAdminNotificationParams(params);
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
        query.then((found) => {
            if (found) {
                let fetchNotificationQuery = dbQueries.getNotificationByItsID(params);
                fetchNotificationQuery.then((isFound) => {
                    if (isFound) {
                        let deleteNotificationQuery = dbQueries.deleteAdminNotificationByItsIDQuery(params);
                        deleteNotificationQuery.then((deleted) => {
                            if (deleted.ok == 1) {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Notification deleted successfully"
                                    }
                                });
                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "Notification failed to delete"
                                    }
                                });
                            }
                        })
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "No notifyID found to delete. Please pass correct ID"
                            }
                        });
                    }
                })
            }
            else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No admin data found. Please pass correct adminId"
                    }
                });
            }
        })
    }
}

function sendMultipleNotificationsToUsers(params, data,callback) {
    var userIDs = params.userIDS;
    for (var i = 0; i < userIDs.length; i++) {
        var userId = userIDs[i];
        sendMultipleNotifications.sendMultipleNotifications(userId, data);
    }    
    let addingNotificationAdminSentInbox = dbQueries.addingPushNotificationsToAdminSentInboxQuery(params.userID, data);
    addingNotificationAdminSentInbox.then((added) => {
        console.log(added);
    })
    callback({
        status: 200,
        data: {
            response: statusCodes.success,
            message: "Notifications send successfully"
        }
    });
    return;
}
module.exports = notificationsSend;

// var getDeviceIds = dbQueries.getDeviceTokens(params);
// getDeviceIds.then((findTokens)=>{
//     var dTokens=[];
//     if(findTokens){
//         for (var j = 0; j < findTokens[0].devices.mobile.length; j++) {
//             dTokens.push(findTokens[0].devices.mobile[j].deviceToken)
//         }
//         for (var j = 0; j < findTokens[0].devices.web.length; j++) {
//             dTokens.push(findTokens[0].devices.web[j].deviceToken)
//         }
//         const folds = dTokens.length % 1000;
//         console.log(folds);
//         const message = {
//             notification: {
//                 "body": params.content,
//                 "title": params.title
//             },
//             data: {
//                 message : params.content
//             }
//         }
//         for (let i = 0; i < folds; i++) {
//             let start = i * 1000,
//                 end = (i + 1) * 1000

//             message['to'] = dTokens.slice(start, end).map((item) => {
//                 return item;                 
//             })
//             var serverkey = "AAAAAn87SCE:APA91bFoXxJL-auBEBRwVoBKoGW6_EBGuTMVrW2cdbitvddbQPp2gBB7T8forp1CBqSZ8WsZCAR-drT_zzNSrNa1pfY6zIhxf_9WYRIKSRBIyzYYyCg9VMGXaWBHjF5oSN5AV4bQP3oV";
//             var fcm = new FCM(serverkey);
//             fcm.send(message, function (err, response) {
//                  if (err) {
//                      console.log(err);
//                      console.log("Something has gone wrong!");
//                  } else {
//                      console.log("Successfully sent with response: ", response);
//                  }
//              });
//             // console.log("device ids "+message);    
//         }
//         var dbData = [];
//         for(var i=0;i<params.userIDS.length;i++){
//             dbData.push({
//                 userID : params.userIDS[i],
//                 notifyInbox : params.title,
//                 messageInbox : params.content
//             })
//         }
//         let insertNotifyInbox=dbQueries.insertNotificationInbox(dbData);
//         insertNotifyInbox.then((Inserted)=>{
//             if(Inserted){
//                 console.log(Inserted);
//                 return callback({ status: 200,
//                     data: {
//                         response: statusCodes.failure,
//                         message: "Insertion successfully",   
//                     }
//                 });
//             }
//             else{
//                 return callback({ status: 200,
//                     data: {
//                         response: statusCodes.failure,
//                         message: "Insertion not successfully",
//                     }
//                 });
//             }
//         }).catch((error)=>{
//             console.log("Error in "+error);
//         })
//     } else{
//         return callback({ status: 200,
//             data: {
//                 response: statusCodes.failure,
//                 message: "Notification not send successfully",

//             }
//         });
//     }
// }).catch((error)=>{
//     console.log(error);
// }); 
