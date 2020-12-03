const dbQueries = require('../../Controllers/PostJobs/PostJobsDBQueries');
var FCM = require('fcm-push');
var nodemailer = require('nodemailer');
var config = require('../../app/ConfigFiles/config.json');
var fs = require('fs');
var pdf = require('html-pdf');
var async = require('async');
const moment = require('moment');




module.exports.admintransactionalNotificationsprovider = function admintransactionalNotificationsprovider(userID,data11) {
    let getSettingsQuery = dbQueries.getUserSettingsBasedOnUserIDQuery(userID);
    getSettingsQuery.then((settings) => {
        if (settings.notifications.transactional.Push == true) {
            console.log('yes it is true...',settings.notifications.transactional.Push);
            let fetchMessagesUnreadCountQuery = dbQueries.getUserUnreadNotifificationCountAggregateQuery(userID);
            fetchMessagesUnreadCountQuery.then((messages) => {
            console.log('unread messages length...',messages.length);
            data.notification.badge = messages.length + 1;
            let notifyQuery = dbQueries.getUserNotificationsQuery(userID);
            notifyQuery.then((dc) => {
                //console.log(dc[0].devices.mobile);

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
        });
            console.log('before query...', data11);
            let addingNotificationToInbox = dbQueries.addingPushNotificationsToInboxQuery(userID, data11);
            addingNotificationToInbox.then((added) => {
                console.log(added);
            })
        }
        if (settings.notifications.transactional.Email == true) {
            console.log("sent to provider....")
            var mail = {
                            admintransactionalNotificationsprovider: function (subject, toEmail) {
                                fs.readFile('./app/ConfigFiles/paymentConfirmationToProvider.html', function (err, data) {
                                    if (!err) {
                                        var str = data.toString();
                                        var html = str.replace();
                                        sendTOMail(toEmail, subject);
                                    }
                                    else {
                                        console.log(err);
                                    }
                                });
                            }
                        }
                        function sendTOMail(toEmail, subject) {
                            var transporter = nodemailer.createTransport({
                                //service: config.mailService,
                                name: 'SMTP',
                                host: 'mail.startasker.com',
                                port: 465,
                                secure: true,
                                auth: {
                                    user: config.authMail,
                                    pass: config.authMailPassword
                                }
                            });
                            var mailOptions = {
                                from: config.fromMail,
                                to: toEmail,
                                subject: subject,
                                html :html
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);

                                } else {
                                    console.log('Email sent: ' + info.response);

                                }
                            });




                module.exports = mail;
            }
            // console.log("sent to provider....")
            // console.log('email notification still in under progress');

        }

    })
    return;
}
