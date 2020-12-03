const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const { success } = require('../../Controllers/Core/StatusCodes');
const sendJobReminderNotifications = require('../../Controllers/Core/JobRemindersNotifications');

var fetchingBooking = {

    fetchBookingBasedOnUserID: (params, callback) => {
        const { error } = paramValidations.validateFetchCustomerBookingsParameters(params);
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

        let fetchQuery = dbQueries.getBookingsByUserIDQuery(params);
        fetchQuery.then((found) => {
            if (found) {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Booking fetched successfully",
                        bookingData: found
                    }
                });
                return;
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Booking fetched failed",
                        bookingData: []
                    }
                });
                return;
            }
        })
    },

    fetchBookingBasedOnBookingID: (params, callback) => {
        const { error } = paramValidations.validateFetchCustomerBookingsWithBookingIDParameters(params);
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
        let fetchQuery = dbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchQuery.then((found) => {
            if (found) {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Booking fetched successfully",
                        bookingData: found
                    }
                });
                return;
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Booking fetched failed",
                        bookingData: []
                    }
                });
                return;
            }
        })
    },
    fetchAllBookingFunction: () => {
        let fetchAllBookingsQuery = dbQueries.fetchAllBookingsQuery();
        fetchAllBookingsQuery.then((found) => {
            if (found) {
                for (var i = 0; i < found.length; i++) {
                    if (found[i].isTaskCompleted == false) {
                        let presentTimeStamp = new Date(new Date().toLocaleDateString()).getTime();
                        console.log('present time stamp...',presentTimeStamp)
                        var arrayOfDates = found[i].taskDate;
                        console.log('dates array length...', arrayOfDates.length);
                        var res = arrayOfDates.map(v => parseInt(v, 10));
                        console.log('converted integer array', res);
                        var lastarrayindex = Math.max(...res) - 86400000;
                        console.log('max timestamp from arrayindex...', lastarrayindex);
                        if (lastarrayindex === presentTimeStamp) {
                            var data = {
                                notification: {
                                    "title": "Booking Reminder",
                                    "body": "Your task " + found[i].taskTitle + " scheduled for tomorrow",
                                    "sound": "default",
                                    "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                    "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + found[i].bookingID
                                },
                                data: {
                                    "Category": found[i].serviceCategory,
                                    "profilePic": found[i].customerProfilePic,
                                    "userID": found[i].userID,
                                    "postID": found[i].postID,
                                    "bookingID": found[i].bookingID,
                                    "type": "TaskReminder",
                                    "completedTo": "Provider"
                                }
                            }
                            for (var j = 0; j < found[i].bookedTaskers.length; j++) {
                                if (found[i].bookedTaskers[j].isWithDraw == false) {
                                    var providerID = found[i].bookedTaskers[j].offeredUserID;
                                    var providerName = found[i].bookedTaskers[j].offeredUserName;
                                    sendJobReminderNotifications.jobRemindersNotifications(providerID, data,found[i].taskTitle,providerName,false);
                                }
                            }
                            var data1 = {
                                notification: {
                                    "title": "Booking Reminder",
                                    "body": "Your task " + found[i].taskTitle + " scheduled for tomorrow",
                                    "sound": "default",
                                    "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                    "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + found[i].bookingID
                                },
                                data: {
                                    "Category": found[i].serviceCategory,
                                    "profilePic": found[i].customerProfilePic,
                                    "userID": found[i].userID,
                                    "postID": found[i].postID,
                                    "bookingID": found[i].bookingID,
                                    "type": "TaskReminder",
                                    "completedTo": "Poster"
                                }
                            }                       
                            sendJobReminderNotifications.jobRemindersNotifications(found[i].userID, data1, found[i].taskTitle,found[i].customerName,true);

                        }
                    }

                }
                console.log('successfully sent remainders to all...')
            } else {
                console.log('no jobs found...')
            }
        })

    }

}

module.exports = fetchingBooking;