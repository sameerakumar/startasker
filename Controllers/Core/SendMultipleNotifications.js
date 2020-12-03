const dbQueries = require('../../Controllers/PostJobs/PostJobsDBQueries');
var FCM = require('fcm-push');

module.exports.sendMultipleNotifications = function sendMultipleNotifications(userID,data) {
    // for(var i=0;i<userIDs.length;i++){
    // console.log('entered into loop...')
    // var userID = userIDs[i];
    let getSettingsQuery = dbQueries.getUserSettingsBasedOnUserIDQuery(userID);
    getSettingsQuery.then((settings) => {
        if (settings.notifications.transactional.Push == true) {
            console.log('yes it is true...');
            let fetchMessagesUnreadCountQuery = dbQueries.getUserUnreadNotifificationCountAggregateQuery(userID);
            fetchMessagesUnreadCountQuery.then((messages) => {
            console.log('unread messages length...',messages.length);
            data.notification.badge = messages.length + 1;
            let notifyQuery = dbQueries.getUserNotificationsQuery(userID);
            notifyQuery.then((dc) => {
                var type = dc[0].devices.mobile;
                var wType = dc[0].devices.web;
                if (type.length > 0) {
                    for (var j = 0; j < dc[0].devices.mobile.length; j++) {
                        if (dc[0].devices.mobile[j].login == true) {
                            var serverkey = "AAAAAn87SCE:APA91bFoXxJL-auBEBRwVoBKoGW6_EBGuTMVrW2cdbitvddbQPp2gBB7T8forp1CBqSZ8WsZCAR-drT_zzNSrNa1pfY6zIhxf_9WYRIKSRBIyzYYyCg9VMGXaWBHjF5oSN5AV4bQP3oV";
                            var fcm = new FCM(serverkey);
                            var message = {
                                to: dc[0].devices.mobile[j].deviceToken, // required fill with device token or topics
                                notification: data.notification,
                                data: data.data
                            };
                            //callback style
                            fcm.send(message, function (err, response) {
                                if (err) {
                                    console.log(err);
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);

                                }
                            });

                        } else {
                            console.log('user has currently logged out from mobile..');
                        }
                    }
                }
                if (wType.length > 0) {
                    console.log('calling from web...');
                    for (var j = 0; j < dc[0].devices.web.length; j++) {
                        if (dc[0].devices.web[j].login == true) {
                            var serverkey = "AAAA9XVmzdo:APA91bEaOUmACcfYxBSHn7GSZfDmUEUGXoCZnk8DPuXATLto9DZmTy8uMM4bz0W6yhF2SmfTAmtwlExnb1EYKzTR0MuzrBBOet6bDu5X_UndDb5A23KJXyP6UGhrUY1aBDcPkXWy69A2";
                            var fcm = new FCM(serverkey);
                            var message = {
                                to: dc[0].devices.web[j].deviceToken, // required fill with device token or topics
                                notification: data.notification,
                                data: data.data
                            };
                            //callback style
                            fcm.send(message, function (err, response) {
                                if (err) {
                                    console.log(err);
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);

                                }
                            });

                        } else {
                            console.log('user has currently logged out from web..');
                        }
                    }
                }
            })
        })
            console.log('before query...', data);
            let addingNotificationToInbox = dbQueries.addingPushNotificationsToInboxQuery(userID, data);
            addingNotificationToInbox.then((added) => {
                console.log(added);
            })
        }
        if (settings.notifications.transactional.Email == true) {
            console.log('email notification still in under progress');
        }

    })
//}
// let addingNotificationAdminSentInbox = dbQueries.addingPushNotificationsToAdminSentInboxQuery(adminUserID, data);
// addingNotificationAdminSentInbox.then((added) => {
//                 console.log(added);
//             })
return;
 
}
