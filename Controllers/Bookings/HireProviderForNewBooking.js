const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const Notifications = require('../Core/TransactionalNotifications');
const Mailer = require('../Core/Mailer');
const moment = require('moment');
const axios = require('axios');
const sha256 = require('sha256');

var HireProvidersForPostJob = {
    hireProviderForTask: (params, callback) => {
        const { error } = paramValidations.validateHireProviderBookingParameters(params);
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
        let fetchBookingByItsID = dbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchBookingByItsID.then((found)=>{
            if(found){
                /*let getPostQuery = dbQueries.getUserPostIDQueryFromPostID(found.postID);
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
                        } else { */
                            let getCustomerInfoQuery = dbQueries.getCustomerInfoBasedOnID(found.userID);
                            getCustomerInfoQuery.then((customerInfo) => {
                                var phone = customerInfo.phoneNumber;                               
                                //console.log('taskers applied length..', params.bookedTaskers.length);
                                checkTransactionStatus(params,(paymentObj)=>{
                                    if(paymentObj != null){
                                        if(paymentObj.TxnExists === "0" && paymentObj.TxnStatus === "0"){
                                            let insertQuery = dbQueries.updateBookingQuery(params);
                                            insertQuery.then((err) => {
                                                if (!err) {
                                                    return callback({
                                                        status: 200,
                                                        data: {
                                                            response: statusCodes.failure,
                                                            message: err
                                                        }
                                                    });
                                                }else{
                                                found.paymentData = params.paymentData;
                                                sendingMailToCustomer(found, phone);
                                                return callback({
                                                    status: 200,
                                                    data: {
                                                        response: statusCodes.success,
                                                        message: "Hires tasker successfully"
                                                        //bookingID: bookingID
                                                    }
                                                });
                                            }
                                            })
                                            }else{
                                                // return callback({
                                                //     status: 200,
                                                //     data: {
                                                //         response: statusCodes.failure,
                                                //         message: "Your payment was not done"
                                                //         //bookingID: bookingID
                                                //     }
                                                // });
                                                let insertQuery = dbQueries.updateBookingQuery(params);
                                                insertQuery.then((err) => {
                                                if (!err) {
                                                    return callback({
                                                        status: 200,
                                                        data: {
                                                            response: statusCodes.failure,
                                                            message: err
                                                        }
                                                    });
                                                }else{
                                                found.paymentData = params.paymentData;
                                                sendingMailToCustomer(found, phone);
                                                return callback({
                                                    status: 200,
                                                    data: {
                                                        response: statusCodes.success,
                                                        message: "Hires tasker successfully"
                                                        //bookingID: bookingID
                                                    }
                                                });
                                            }
                                            })
                                            }
                                    }
                                });
                            })
                   /*     }
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
                })*/
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No booking found with this ID"
                    }
                });
                return;
            }
        })      
    }

}

function sendingMailToCustomer(params, phoneNumber) {    
    params.dates = getLocalDateFromUnixTimestamp(params);
    params.timings = getConvenieantTimings(params);        
    asyncloop(0, params, phoneNumber,()=>{});     
} 
    function asyncloop(i, params,phoneNumber,callback){
        if(i < params.bookedTaskers.length){            
            sentBookingConfirmationNotifyAndMail(params,params.bookedTaskers[i],phoneNumber,()=>{
                asyncloop( i+1, params,params.bookedTaskers[i],phoneNumber,callback); 
                console.log('providers...',params.bookedTaskers[i]);                 
            });            
        }
    }   

function sentBookingConfirmationNotifyAndMail(params,bookedTaskers,phoneNumber,callback) { 
                let getTaskerInfoQuery = dbQueries.getCustomerInfoBasedOnID(bookedTaskers.offeredUserID);
                getTaskerInfoQuery.then((tasker) => {
                    Mailer.sendToCustomerMail("Booking Confirmation", params.userID, params.customerName, bookedTaskers.offeredUserName, params.taskTitle, params.loc, params.dates,params.timings, params.location, tasker.phoneNumber, tasker.offeredUserID,params);
                    Mailer.sendToTaskerMail("Booking Confirmation", bookedTaskers.offeredUserID, params.customerName, bookedTaskers.offeredUserName, params.taskTitle, params.loc, params.dates, params.timings, params.location, phoneNumber, params.userID);
               })
            var data = {
                notification: {
                    "title": "Booking Confirmation",
                    "body": "You have been booked for the task " + params.taskTitle + " posted by " + params.customerName,
                    "sound": "notification_alertsound.mp3",
                    //"icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                    //"click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + params.bookingID
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
            Notifications.transactionalNotifications(bookedTaskers.offeredUserID, data);
            callback();
}
function checkTransactionStatus(params,callback){
    //console.log('payment data object...',params.paymentData);
    let creatHash = "H71BRDU8" + "CLS" + params.paymentData.PaymentID + params.paymentData.Amount + "MYR";
                let hashvalue = sha256(creatHash);
                const object = new URLSearchParams({
                    Amount: params.paymentData.Amount,
                    CurrencyCode: "MYR",
                    HashValue: hashvalue,
                    PaymentID: params.paymentData.PaymentID,
                    PymtMethod: params.paymentData.PymtMethod,
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
                        var pairs = res.data.split('&');
                        var result = {};
                        pairs.forEach((pair) => {
                            pair = pair.split('=');
                            result[pair[0]] = decodeURIComponent(pair[1] || '');
                        });
                        var paymentObj =  JSON.parse(JSON.stringify(result));
                        console.log("PaymentObj", paymentObj);
                        return callback(paymentObj); 
                    })
                    .catch(error => {
                        console.error(error)
                        return callback(null);
                    })
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
module.exports = HireProvidersForPostJob;