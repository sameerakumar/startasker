const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const axios = require('axios');
const sha256 = require('sha256');
var UpdatePaymentStatusForBooking = {
    checkPaymentStatus: () => {
        let fetchBookings = dbQueries.fetchAllBookingsQuery();
        fetchBookings.then((found) => {
            if (found) {
                //console.log('db data...', found);
                for (var i = 0; i < found.length; i++) {
                    var params = {};
                    params.paymentID = found[i].paymentID;
                    params.bookingID = found[i].bookingID;
                    params.amount = found[i].taskTotalBudget.toString();
                    params.userID = found[i].userID;
                    let creatHash = "H71BRDU8" + "CLS" + params.paymentID + params.amount + ".00" + "MYR";
                    let hashvalue = sha256(creatHash);
                    const object = new URLSearchParams({
                        Amount: params.amount + ".00",
                        CurrencyCode: "MYR",
                        HashValue: hashvalue,
                        PaymentID: params.paymentID,
                        PymtMethod: "ANY",
                        ServiceID: "CLS",
                        TransactionType: "QUERY"
                    }).toString();
                    console.log(object);
                    var config = {
                        responseType: 'text'
                    };
                    axios
                        .post('https://securepay.e-ghl.com/IPG/payment.aspx', object, config)
                        .then(res => {
                            //console.log(`statusCode: ${res.statusCode}`)
                            //console.log('client response...', res);
                            var pairs = res.data.split('&');
                            var result = {};
                            pairs.forEach((pair) => {
                                pair = pair.split('=');
                                result[pair[0]] = decodeURIComponent(pair[1] || '');
                            });
                            var paymentObj = JSON.parse(JSON.stringify(result));
                            params.paymentData = paymentObj;
                            //console.log("PaymentObj", paymentObj);
                            if (paymentObj.TxnExists === "0" && paymentObj.TxnStatus === "0") {
                                sentBookingConfirmation(params);
                            } else {
                                console.log('payment details not found...');
                            }
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
            } else {
                console.log('no bookings data available...');
            }
        })
    }

}
function sentBookingConfirmation(params) {
    let getCustomerInfoQuery = dbQueries.getCustomerInfoBasedOnID(params.userID);
    getCustomerInfoQuery.then((customerInfo) => {
        var phone = customerInfo.phoneNumber;
        sendingMailToCustomer(params, phone);
    })
}
function sendingMailToCustomer(params, phoneNumber) {
    params.dates = getLocalDateFromUnixTimestamp(params);
    params.timings = getConvenieantTimings(params);
    asyncloop(0, params, phoneNumber, () => { });
}
function asyncloop(i, params, phoneNumber, callback) {
    if (i < params.bookedTaskers.length) {
        params.offeredUserName = params.bookedTaskers[i].offeredUserName;
        params.offeredUserID = params.bookedTaskers[i].offeredUserID;
        params.budget = params.bookedTaskers[i].budget;
        params.taskTitle = params.taskTitle;
        sentBookingConfirmationNotifyAndMail(params, phoneNumber, () => {
            console.log('i value...', params.bookedTaskers.length);
            asyncloop(i + 1, params, callback);
        });
    }
}
function sentBookingConfirmationNotifyAndMail(params, phoneNumber, callback) {
    let getTaskerInfoQuery = dbQueries.getCustomerInfoBasedOnID(params.offeredUserID);
    getTaskerInfoQuery.then((tasker) => {
        Mailer.sendToCustomerMail("Booking Confirmation", params.userID, params.customerName, params.offeredUserName, params.taskTitle, params.loc, params.dates, params.timings, params.location, tasker.phoneNumber, params.offeredUserID, params);
        Mailer.sendToTaskerMail("Booking Confirmation", params.offeredUserID, params.customerName, params.offeredUserName, params.taskTitle, params.loc, params.dates, params.timings, params.location, phoneNumber, params.userID);
    })
    var data = {
        notification: {
            "title": "Booking Confirmation",
            "body": "You have been booked for the task " + params.taskTitle + " posted by " + params.customerName,
            "sound": "notification_alertsound.mp3",
            "icon": "https:/api.startasker.com/startasker-new-logo2-1.png",
            "click_action": "https://www.staging.startasker.com/#/my-account/inbox"
        },
        data: {
            "Category": params.serviceCategory,
            "profilePic": params.customerProfilePic,
            "userID": params.userID,
            "postID": params.postID,
            "bookingID": params.bookingID,
            "type": "Booking",
            "completedTo": "Provider"
        }
    }
    Notifications.transactionalNotifications(params.offeredUserID, data);
    callback();
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
module.exports = UpdatePaymentStatusForBooking;