const dbQueries = require('../../Controllers/PostJobs/PostJobsDBQueries');
var FCM = require('fcm-push');
const distFrom = require('distance-from');

module.exports.sendPostJobNotifications = function sendPostJobNotifications(userID, data, category,long,lat,title) {
    let getSettingsQuery = dbQueries.getUserSettingsBasedOnUserIDQuery(userID);
    getSettingsQuery.then((settings) => {
        //console.log('user settings...',settings.notifications.taskUpdates);
        if (settings.notifications.taskUpdates.Push == true) {
            console.log('yes it is true...');
            if (settings.taskAlerts.alerts == true) {
                //console.log('task alert length...',settings.taskAlerts.customAlerts);
                if (settings.taskAlerts.customAlerts.length > 0) {
                    for(var i=0;i<settings.taskAlerts.customAlerts.length;i++){
                        if(settings.taskAlerts.customAlerts[i].alertType.inPerson == true){                            
                        var taskDistance = settings.taskAlerts.customAlerts[i].taskDistance;
                        var postJobCoordinates = [parseFloat(lat),parseFloat(long)];
                        var taskalertCoordinates = settings.taskAlerts.customAlerts[i].taskLoc;
                        //console.log('alert radius...',alertRadius);
                        var taskNames = settings.taskAlerts.customAlerts[i].taskName;
                        var taskKeywords = settings.taskAlerts.customAlerts[i].taskKeyword;
                        var array3 = taskNames.concat(taskKeywords);
                        if (array3.some(v => title.includes(v)) || array3.some(v => category.includes(v)) ) {
                            var dist = distFrom(postJobCoordinates).to(taskalertCoordinates).in('km').toFixed();
                            console.log('two cordinates distance is...',dist);
                            if(taskDistance <= dist){
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
                                                console.log('user has currently logged out from android..');
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
                        }
                        }else if(settings.taskAlerts.customAlerts[i].alertType.remote == true){
                            var taskNames = settings.taskAlerts.customAlerts[i].taskName;
                            var taskKeywords = settings.taskAlerts.customAlerts[i].taskKeyword;
                            var array3 = taskNames.concat(taskKeywords)
                        if (array3.some(v => title.includes(v)) || array3.some(v => category.includes(v)) ) {
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
                                                console.log('user has currently logged out from android..');
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
                                console.log('before query...', data);
                                let addingNotificationToInbox = dbQueries.addingPushNotificationsToInboxQuery(userID, data);
                                addingNotificationToInbox.then((added) => {
                                    console.log(added);
                                })
                        }
                        }
                    }                   
                } 
            }

        }
        if (settings.notifications.taskUpdates.Email == true) {
            console.log('email notification still in under progress');
        }

    })
}
