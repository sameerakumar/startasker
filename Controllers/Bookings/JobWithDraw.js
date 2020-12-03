const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const Notification = require('../Core/TransactionalNotifications');

var jobWithDrawController = {

    withDrawByCustomer: (params, callback) => {
        const { error } = paramValidations.validateJobWithDrawByCustomer(params);
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
        let fetchBooking = dbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchBooking.then((found) => {
            if (found) {
                var postID = found.postID;
                let getPostQuery = dbQueries.getUserPostIDQueryFromPostID(postID);
                getPostQuery.then((post) => {
                    if (post.jobAppliedCount == 0 && post.jobSelectedCount == 0) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "No job found to with drawn on this user"
                            }
                        });
                        return;
                    } else {
                        var jobAppliedCount = post.jobAppliedCount - 1;
                        var jobSelectedCount = post.jobSelectedCount - 1;
                        if (jobAppliedCount == 0 && jobSelectedCount == 0) {
                            console.log('yes both counts are zero..')
                            let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(jobSelectedCount, postID);
                            let jobAppliedCountQuery = dbQueries.updateJobAppliedCountCountQuery(jobAppliedCount, postID);
                            let updateWithDrawStatusInOffersQuery = dbQueries.updateWithDrawStatusInOffersQuery(params, postID);
                            let pullProviderFromOffers = dbQueries.pullProviderOfferFromOffersArrayQuery(postID, params.offeredUserID);
                            let updatePostStatusQuery = dbQueries.updatePostJobStatusAsOpenQuery(postID);
                            updatePostStatusQuery.then((updated) => {
                                if (updated) {
                                    var boolean = false;
                                    for (var i = 0; i < found.bookedTaskers.length; i++) {
                                        if (params.withDrawnByPoster == true) {
                                            let withDrawJobQuery = dbQueries.withDrawJobByCustomerQuery(params);
                                            withDrawJobQuery.then((success) => {
                                                console.log('customer with draw...',success);
                                            })
                                            var data = {
                                                notification: {
                                                    "title": "StarTasker",
                                                    "body": "Poster " + found.customerName + " has been with drawn from allocated task " + found.taskTitle + " to you",
                                                    "sound": "default",
                                                    "icon": "https:/api.startasker.com/startasker-new-logo2-1.png",
                                                    "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                                                },
                                                data: {
                                                    "profilePic": found.customerProfilePic,
                                                    "userID": found.userID,
                                                    "postID": found.postID,
                                                    "bookingID": params.bookingID,
                                                    "type": "WithDrawn",
                                                    "withDrawnTo": "Provider"

                                                }
                                            }
                                            Notification.transactionalNotifications(params.offeredUserID, data);
                                        } else {
                                            if (found.bookedTaskers[i].offeredUserID === params.offeredUserID) {
                                                boolean = true;
                                                let withDrawJobQuery = dbQueries.withDrawJobByProviderQuery(params);
                                                withDrawJobQuery.then((success) => {
                                                console.log('provider with draw...',success);
                                                })
                                                var data = {
                                                    notification: {
                                                        "title": "StarTasker",
                                                        "body": "Provider " + found.bookedTaskers[i].offeredUserName + " has been with drawn from your post " + found.taskTitle,
                                                        "sound": "default",
                                                        "icon": "https:/api.startasker.com/startasker-new-logo2-1.png",
                                                        "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                                                    },
                                                    data: {
                                                        "profilePic": found.bookedTaskers[i].offeredUserProfilePic,
                                                        "userID": found.bookedTaskers[i].offeredUserID,
                                                        "postID": found.postID,
                                                        "bookingID": params.bookingID,
                                                        "type": "WithDrawn",
                                                        "withDrawnTo": "Poster"
                                                    }
                                                }
                                                Notification.transactionalNotifications(found.userID, data);
                                                break;
                                            }
                                        }
                                    }
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.success,
                                            message: "Task with drawed successfully"
                                        }
                                    });
                                    return;
                                } else {
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: "Task with drawed failed"
                                        }
                                    });
                                    return;
                                }
                            })
                        } else {
                            let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(jobSelectedCount, postID);
                            let jobAppliedCountQuery = dbQueries.updateJobAppliedCountCountQuery(jobAppliedCount, postID);
                            let updateWithDrawStatusInOffersQuery = dbQueries.updateWithDrawStatusInOffersQuery(params, postID);
                            let pullProviderFromOffers = dbQueries.pullProviderOfferFromOffersArrayQuery(postID, params.offeredUserID);
                            let updatePostStatusQuery = dbQueries.updatePostJobStatusAsOpenQuery(postID);
                            updatePostStatusQuery.then((updated) => {
                                if (updated) {
                                    var boolean = false;
                                    for (var i = 0; i < found.bookedTaskers.length; i++) {
                                        if (params.withDrawnByPoster == true) {
                                            let withDrawJobQuery = dbQueries.withDrawJobByCustomerQuery(params);
                                            withDrawJobQuery.then((success) => {
                                                console.log('customer with draw...',success);
                                            })
                                            var data = {
                                                notification: {
                                                    "title": "StarTasker",
                                                    "body": "Poster " + found.customerName + " has been with drawn from allocated task " + found.taskTitle + " to you",
                                                    "sound": "default",
                                                    "icon": "https:/api.startasker.com/startasker-new-logo2-1.png",
                                                    "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                                                },
                                                data: {
                                                    "profilePic": found.customerProfilePic,
                                                    "userID": found.userID,
                                                    "postID": found.postID,
                                                    "bookingID": params.bookingID,
                                                    "type": "WithDrawn",
                                                    "withDrawnTo": "Provider"

                                                }
                                            }
                                            Notification.transactionalNotifications(params.offeredUserID, data);
                                        } else {
                                            if (found.bookedTaskers[i].offeredUserID === params.offeredUserID) {
                                                boolean = true;
                                                let withDrawJobQuery = dbQueries.withDrawJobByProviderQuery(params);
                                                withDrawJobQuery.then((success) => {
                                                console.log('provider with draw...',success);
                                                })
                                                var data = {
                                                    notification: {
                                                        "title": "StarTasker",
                                                        "body": "Provider " + found.bookedTaskers[i].offeredUserName + " has been with drawn from your post " + found.taskTitle,
                                                        "sound": "default",
                                                        "icon": "https:/api.startasker.com/startasker-new-logo2-1.png",
                                                        "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
                                                    },
                                                    data: {
                                                        "profilePic": found.bookedTaskers[i].offeredUserProfilePic,
                                                        "userID": found.bookedTaskers[i].offeredUserID,
                                                        "postID": found.postID,
                                                        "bookingID": params.bookingID,
                                                        "type": "WithDrawn",
                                                        "withDrawnTo": "Poster"
                                                    }
                                                }
                                                Notification.transactionalNotifications(found.userID, data);
                                                break;
                                            }
                                        }
                                    }
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.success,
                                            message: "Task with drawed successfully"
                                        }
                                    });
                                    return;
                                } else {
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: "Task with drawed failed"
                                        }
                                    });
                                    return;
                                }
                            })
                        }
                    }

                })
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

module.exports = jobWithDrawController;