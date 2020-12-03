const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const Notifications = require('../Core/TransactionalNotifications');
const Mailer = require('../Core/Mailer');
const moment = require('moment');

var newBookingForPostJob = {

    insertNewBooking: (params, callback) => {
        const { error } = paramValidations.validateBookingParameters(params);
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
        let getPostQuery = dbQueries.getUserPostIDQueryFromPostID(params.postID);
        getPostQuery.then((ifFound) => {
            if (ifFound) {
                if (ifFound.post_Status === 'Assigned') {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "This post already assigned"
                        }
                    });
                    return;
                } else {
                    let getCustomerInfoQuery = dbQueries.getCustomerInfoBasedOnID(params.userID);
                    getCustomerInfoQuery.then((customerInfo) => {
                        var phone = customerInfo.phoneNumber;
                        console.log('number of workers customer selected...', ifFound.numberOfWorkers);
                        var totalWorkesCount = ifFound.numberOfWorkers;
                        var bookedTaskersCount = ifFound.jobSelectedCount;
                        console.log('taskers applied length..', params.bookedTaskers.length);
                        //var bookingID = 'STR' + GenerateRandomID.makeId();
                        // if(params.bookedTaskers.length === ifFound.numberOfWorkers){
                        let insertQuery = dbQueries.newBookingInsertQuery(params);
                        insertQuery.save((err) => {
                            if (err) {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: err
                                    }
                                });
                            }
                            else{
                            sendingMailToCustomer(params, totalWorkesCount, bookedTaskersCount, phone);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Hires tasker successfully"
                                    //bookingID: bookingID
                                }
                            });
                            return;
                        }
                        })
                    })
                }
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No post data found with this ID"
                    }
                });
                return;
            }
        })
    }

}

function sendingMailToCustomer(params, totalWorkersCount, bookedTaskersCount, phoneNumber) {
    console.log('array length...', params.bookedTaskers.length);
    var totalTaskersCount = totalWorkersCount;
    var bookedTaskerCount = bookedTaskersCount + params.bookedTaskers.length;
    var dates = getLocalDateFromUnixTimestamp(params);
    var timings = getConvenieantTimings(params);
    if (bookedTaskerCount == totalTaskersCount) {
        for (var i = 0; i < params.bookedTaskers.length; i++) {
            var offeredUserName = params.bookedTaskers[i].offeredUserName;
            var offeredUserID = params.bookedTaskers[i].offeredUserID;
            var taskTitle = params.taskTitle;
            let updateQuery = dbQueries.updateProviderHiredStatusInPostJob(params, offeredUserID);
            updateQuery.then((updated) => {
                console.log('updated successfully...', updated);
                let getTaskerInfoQuery = dbQueries.getCustomerInfoBasedOnID(offeredUserID);
                getTaskerInfoQuery.then((tasker) => {
                    Mailer.sendToCustomerMail("Booking Confirmation", params.userID, params.customerName, offeredUserName, taskTitle, params.loc, dates, timings, params.location, tasker.phoneNumber, offeredUserID,params);
                    Mailer.sendToTaskerMail("Booking Confirmation", offeredUserID, params.customerName, offeredUserName, taskTitle, params.loc, dates, timings, params.location, phoneNumber, params.userID);
               })
            })
            var data = {
                notification: {
                    "title": "Booking Confirmation",
                    "body": "You have been booked for the task " + taskTitle + " posted by " + params.customerName,
                    "sound": "default",
                },
                data: {
                    "Category": params.serviceCategory,
                    "profilePic": params.customerProfilePic,
                    "userID": params.userID,
                    "postID": params.postID,
                    "bookingID": params.bookingID,
                    "type": "Booking",
                    "completedTo":"Provider"
                }
            }
            Notifications.transactionalNotifications(offeredUserID, data);
        }
        let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(bookedTaskerCount, params.postID);
        let statusUpdate = dbQueries.getPostJobStatusUpdateQuery(params.postID);
        if(params.couponCode != null){
            let couponUpdate = dbQueries.customerCouponUpdateQuery(params);
            couponUpdate.then((updated)=>{
                console.log('coupon updated...',updated);
            })
        }
    } else {
        for (var i = 0; i < params.bookedTaskers.length; i++) {
            var offeredUserName = params.bookedTaskers[i].offeredUserName;
            var offeredUserID = params.bookedTaskers[i].offeredUserID;
            var taskTitle = params.taskTitle;
            let updateQuery = dbQueries.updateProviderHiredStatusInPostJob(params, offeredUserID);
            updateQuery.then((updated) => {
                console.log('updates success...', updated);
                let getTaskerInfoQuery = dbQueries.getCustomerInfoBasedOnID(offeredUserID);
                getTaskerInfoQuery.then((tasker) => {
                    Mailer.sendToCustomerMail("Booking Confirmation", params.userID, params.customerName, offeredUserName, taskTitle, params.loc, dates, timings, params.location, tasker.phoneNumber, offeredUserID,params);
                    Mailer.sendToTaskerMail("Booking Confirmation", offeredUserID, params.customerName, offeredUserName, taskTitle, params.loc, dates, timings, params.location, phoneNumber, params.userID);

                })
            })

            var data = {
                notification: {
                    "title": "Booking Confirmation",
                    "body": "You have been booked for the task " + taskTitle + " posted by " + params.customerName,
                    "sound": "default",
                },
                data: {
                    "Category": params.serviceCategory,
                    "profilePic": params.customerProfilePic,
                    "userID": params.userID,
                    "postID": params.postID,
                    "bookingID": params.bookingID,
                    "type": "Booking",
                    "completedTo":"Provider"
                }
            }
            Notifications.transactionalNotifications(offeredUserID, data);
        }
        let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(bookedTaskerCount, params.postID);
        if(params.couponCode != null){
            let couponUpdate = dbQueries.customerCouponUpdateQuery(params);
            couponUpdate.then((updated)=>{
                console.log('coupon updated...',updated);
            })
        }
    }
    return;
}

function getConvenieantTimings(params) {
    var timings = [];
    if (params.convenientTimings.length > 0) {
        for (var j = 0; j < params.convenientTimings.length; j++) {
            if (params.convenientTimings[j] === 'Morning') {
                var Morning = 'Morning before 10am';
                timings.push(Morning);
            }
            if (params.convenientTimings[j] === 'Midday') {
                var Midday = 'Midday 10am to 2pm';
                timings.push(Midday);
            }
            if (params.convenientTimings[j] === 'Afternoon') {
                var Afternoon = 'Afternoon 2pm to 6pm';
                timings.push(Afternoon);
            }
            if (params.convenientTimings[j] === 'Evening') {
                var Evening = 'Evening after 6pm';
                timings.push(Evening);
            }
        }
    } else {
        var Anytime = 'Anytime'
        timings.push(Anytime);
    }
    return timings;
}
function getLocalDateFromUnixTimestamp(params) {
    console.log('unix array of dates...', params.taskDate);
    var Dates = [];
    for (var i = 0; i < params.taskDate.length; i++) {
        var unixTime = parseInt(params.taskDate[i]);
        var dates = moment(unixTime + 86400000).format("MM/DD/YYYY");
        //var dates =  new Date(unixTime).toLocaleDateString();
        Dates.push(dates);
        console.log('local array dates...', Dates);
    }
    return Dates;
}
module.exports = newBookingForPostJob;