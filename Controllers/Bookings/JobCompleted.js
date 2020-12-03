const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const Notifications = require('../Core/TransactionalNotifications');
const moment = require('moment');

var JobStatusCompletedByCustomer = {
    jobCompleteStatusProvideByCustomer: (params, callback) => {
        const { error } = paramValidations.validateJobCompletedStatusByCustomer(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return
        }
        if (params.isCompletedByPoster === true) {
            console.log('entered into poster block...');
            let getBookingIDQuery = dbQueries.getBookingsBasedOnBookingIDQuery(params);
            getBookingIDQuery.then((ifFound) => {
                if (ifFound) {
                    if (ifFound.bookedTaskers.length === params.bookedTaskers.length) {
                        return updateTaskCompletedStatus(params, ifFound, callback);
                    } else {
                        var count = 0;
                        for (var j = 0; j < ifFound.bookedTaskers.length; j++) {
                            if (ifFound.bookedTaskers[j].isCustomerCompletedTask === true && ifFound.bookedTaskers[j].isWithDraw === false) {
                                count = count + 1;
                            }
                        }
                        var totalCount = count + params.bookedTaskers.length;
                        if (totalCount === ifFound.bookedTaskers.length) {
                            return updateTaskCompletedStatus(params, ifFound, callback);
                        } else {
                            for (i = 0; i < params.bookedTaskers.length; i++) {
                                var userID = params.bookedTaskers[i].offeredUserID;

                                let jobCompleteQuery = dbQueries.updateJobCompletedStatus(params, userID);
                                let taskCompletedQuery = dbQueries.updateCustomerTaskCompleted(params);
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Job completed status updated"
                                }
                            });
                            return;

                        }
                    }

                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "No booking data found with this ID"
                        }
                    });
                    return;
                }
            })
        } else {
            let getBookingIDQuery = dbQueries.getBookingsBasedOnBookingIDQuery(params);
            getBookingIDQuery.then((ifFound) => {
                if (ifFound) {
                    if (ifFound.bookedTaskers.length === params.bookedTaskers.length) {
                        return updateTaskCompletedStatus(params, ifFound, callback);
                    } else {
                        var count = 0;
                        for (var j = 0; j < ifFound.bookedTaskers.length; j++) {
                            if (ifFound.bookedTaskers[j].isTaskerCompletedTask === true && ifFound.bookedTaskers[j].isWithDraw === false) {
                                count = count + 1;
                            }
                        }
                        var totalCount = count + params.bookedTaskers.length;
                        if (totalCount === ifFound.bookedTaskers.length) {
                            return updateTaskCompletedStatus(params, ifFound, callback);
                        } else {
                            for (i = 0; i < params.bookedTaskers.length; i++) {
                                var userID = params.bookedTaskers[i].offeredUserID;
                                let jobCompleteQuery = dbQueries.updateJobCompletedStatusByProvider(params, userID);
                                jobCompleteQuery.then((success)=>{
                                    console.log('success...',success);
                                    for (var j = 0; j < ifFound.bookedTaskers.length; j++) {
                                        if (ifFound.bookedTaskers[j].offeredUserID === userID) {
                                            var data = {
                                                notification: {
                                                    "title": "Task completion",
                                                    "body": "Provider " + ifFound.bookedTaskers[j].offeredUserName+ "completed your assigned task " + ifFound.taskTitle,
                                                    "sound": "default",
                                                    "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                                    "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                                                },
                                                data: {
                                                    "profilePic": ifFound.bookedTaskers[j].offeredUserProfilePic,
                                                    "userID": userID,
                                                    "postID": ifFound.postID,
                                                    "bookingID": params.bookingID,
                                                    "type": "Booking",
                                                    "completedTo":"Poster"
                                                }
                                            }
                                            Notifications.transactionalNotifications(ifFound.userID, data);
                                        }
                                    }
                                })
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Job completed status updated"
                                }
                            });
                            return;
                        }
                    }
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "No booking data found with this ID"
                        }
                    });
                    return;
                }
            })
        }
    }
}

function updateTaskCompletedStatus(params, found, callback) {
    if (params.isCompletedByPoster === true) {
        for (i = 0; i < params.bookedTaskers.length; i++) {
            var userID = params.bookedTaskers[i].offeredUserID;
            let jobCompleteQuery = dbQueries.updateJobCompletedStatus(params, userID);
            jobCompleteQuery.then((success) => {
                console.log('success...', success);
                let taskCompletedQuery = dbQueries.updateCustomerTaskCompleted(params);
                taskCompletedQuery.then((success1) => {
                    console.log('success1...', success1);
                    let providerjobCompleteQuery = dbQueries.updateJobCompletedStatusByProvider(params, userID);
                    providerjobCompleteQuery.then((success2) => {
                        console.log('success2...', success2);
                        var data = {
                            notification: {
                                "title": "Task completion",
                                "body": "Poster " +found.customerName +" given task completion assigned to you",
                                "sound": "default",
                                "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                            },
                            data: {
                                "profilePic": found.customerProfilePic,
                                "userID": found.userID,
                                "postID": found.postID,
                                "bookingID": params.bookingID,
                                "type": "Booking",
                                "completedTo":"Provider"
                            }
                        }
                        Notifications.transactionalNotifications(userID, data);
                    })
                })
            })
        }
        checkReferralProgram(found);
        callback({
            status: 200,
            data: {
                response: statusCodes.success,
                message: "Job completed status updated"
            }
        });
        return;
    } else {
        for (i = 0; i < params.bookedTaskers.length; i++) {
            var userID = params.bookedTaskers[i].offeredUserID;
            let jobCompleteQuery = dbQueries.updateJobCompletedStatusByProvider(params, userID);
            jobCompleteQuery.then((success)=>{
                console.log('success...',success);
                for (var j = 0; j < found.bookedTaskers.length; j++) {
                    if (found.bookedTaskers[j].offeredUserID === userID) {
                        var data = {
                            notification: {
                                "title": "Task completion",
                                "body": "Provider " + found.bookedTaskers[j].offeredUserName+ "completed your assigned task " + found.taskTitle,
                                "sound": "default",
                                "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                            },
                            data: {
                                "profilePic": found.bookedTaskers[j].offeredUserProfilePic,
                                "userID": userID,
                                "postID": found.postID,
                                "bookingID": params.bookingID,
                                "type": "Booking",
                                "completedTo":"Poster"
                            }
                        }
                        Notifications.transactionalNotifications(found.userID, data);
                    }
                }
            })
        }
        callback({
            status: 200,
            data: {
                response: statusCodes.success,
                message: "Job completed status updated"
            }
        });
        return;
    }
}

function checkReferralProgram(found) {
    // Checking booking poster information
    let paymentdate = new Date().getTime();
    var time = moment(paymentdate).format('MMM, yyyy').toString();
    let customerInfoQuery = dbQueries.getCustomerInfoBasedOnID(found.userID)
    customerInfoQuery.then((customerFound) => {
        if (customerFound.isFirstTaskDone === false || typeof customerFound.isFirstTaskDone === "undefined") {
            if (typeof customerFound.signupReferralInfo !== "undefined") {
                let refferedPersonQuery = dbQueries.getCustomerInfoBasedOnID(customerFound.signupReferralInfo.userID);
                refferedPersonQuery.then((refferedUser) => {
                    let earnMoney = ((found.taskTotalBudget * 10) / 100).toFixed(2);
                    if(earnMoney > 25){
                        earnMoney = 25;
                    }
                    let objEarn = {
                        referralCode: refferedUser.referralCode,
                        referByUserID: refferedUser.userID,
                        referToUserID: customerFound.userID,
                        postID: found.postID,
                        bookingID: found.bookingID,
                        taskTitle: found.taskTitle,
                        isTaskar: false,
                        bookingAmount: found.taskTotalBudget,
                        earningDate: time,
                        earnAmount: earnMoney,
                    }
                    let referredEarningInsertQuery = dbQueries.referralEarningInsert(objEarn);
                    referredEarningInsertQuery.save((err) => {
                        if (!err) {
                            console.log("saved referrel earn");
                            let updateCustomerQuery = dbQueries.getUpdateQueryForUserFirstTaskDone(customerFound.userID);
                            updateCustomerQuery.then((updateStatus) => {
                                if (updateStatus.nModified === 1) {
                                    // send notification to reffered person as he earn money for pariticualr refferal and how much he earn.
                                    var data = {
                                        notification: {
                                            "title": "Earned Referral Amount",
                                            "body": "You have recieved referral amount first task completed by referred user " + found.customerName,
                                            "sound": "default",
                                            "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                            "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + found.bookingID
                                        },
                                        data: {
                                            "profilePic": found.customerProfilePic,
                                            "userID": found.userID,
                                            "postID": found.postID,
                                            "bookingID": found.bookingID,
                                            "type": "Earnings",
                                            "completedTo":"Poster"
                                        }
                                    }
                                    Notifications.transactionalNotifications(refferedUser.userID, data);
                                } else {
                                    console.log("user not updated for first task done");
                                }
                            })
                        } else {
                            console.log(err);
                        }
                    })

                })

            }
        }
    });
    // Checking Booking providers
    for (var tasker of found.bookedTaskers) {
        let providerInfoQuery = dbQueries.getCustomerInfoBasedOnID(tasker.offeredUserID)
        providerInfoQuery.then((providerFound) => {
            if (providerFound.isFirstTaskDone === false || typeof providerFound.isFirstTaskDone === "undefined") {
                if (typeof providerFound.signupReferralInfo !== "undefined") {
                    let refferedPersonQuery = dbQueries.getCustomerInfoBasedOnID(providerFound.signupReferralInfo.userID);
                    refferedPersonQuery.then((refferedUser) => {
                        let netBudget = tasker.budget - ((tasker.budget * 20) / 100);
                        let earnMoney = ((netBudget * 10) / 100).toFixed(2);
                        if(earnMoney > 25){
                            earnMoney = 25;
                        }
                        let objEarn = {
                            referralCode: refferedUser.referralCode,
                            referByUserID: refferedUser.userID,
                            referToUserID: providerFound.userID,
                            postID: found.postID,
                            bookingID: found.bookingID,
                            taskTitle: found.taskTitle,
                            isTaskar: true,
                            bookingAmount: netBudget,
                            earningDate: time,
                            earnAmount: earnMoney,
                        }
                        let referredEarningInsertQuery = dbQueries.referralEarningInsert(objEarn);
                        referredEarningInsertQuery.save((err) => {
                            if (!err) {
                                console.log("saved referrel earn");
                                let updateCustomerQuery = dbQueries.getUpdateQueryForUserFirstTaskDone(providerFound.userID);
                                updateCustomerQuery.then((updateStatus) => {
                                    if (updateStatus.nModified === 1) {
                                        // send notification to reffered person as he earn money for pariticualr refferal and how much he earn.
                                        var data = {
                                            notification: {
                                                "title": "Earned Referral Amount",
                                                "body": "You have recieved referral amount first task completed by referred user " + tasker.offeredUserName,
                                                "sound": "default",
                                                "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                                "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + found.bookingID
                                            },
                                            data: {
                                                "profilePic": tasker.offeredUserProfilePic,
                                                "userID": tasker.userID,
                                                "postID": found.postID,
                                                "bookingID": found.bookingID,
                                                "type": "Earnings",
                                                "completedTo":"Provider"
                                            }
                                        }
                                        Notifications.transactionalNotifications(refferedUser.userID, data);
                                    } else {
                                        console.log("user not updated for first task done");
                                    }
                                });
                            } else {
                                console.log(err);
                            }
                        })
                    });
                }

            }
        });
    }
}
module.exports = JobStatusCompletedByCustomer;