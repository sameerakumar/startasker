const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./ReviewParamValidations');
const dbQueries = require('./ReviewDBQueries');
const bookingDbQueries = require('../Bookings/BookingsDBQueries');
const Notifications = require('../Core/Notifications');

var FeedBackToCustomer = {
    toCustomer: (params, callback) => {
        const { error } = paramValidator.validateCustomerRatingsParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let fetchBooking = bookingDbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchBooking.then((found) => {
            if (found) {
                var ratingsToPoster = false;
                var bookedTaskers = found.bookedTaskers;
                for(var i=0;i<bookedTaskers.length;i++){
                    var userID = bookedTaskers[i].offeredUserID;
                    if(userID === params.ratingsGivenBy.userID){
                        ratingsToPoster = bookedTaskers[i].ratingsToPoster;
                    }                   
                }
                if(ratingsToPoster === false){
                    let ReviewQuery = dbQueries.ratingsToCustomerQuery(params);
                    ReviewQuery.save((Found) => {
                        if (!Found) {
                            let updateQuery = dbQueries.updateProviderRatingsToCustomer(params);
                            updateQuery.then((updated)=>{
                                console.log('updated data...',updated);
                                var data = {
                                    notification:{
                                        "title": "StarTasker",
                                        "body": params.ratingsGivenBy.name + " provider has given ratings to you for the post " + params.postTitle,
                                        "sound": "default",
                                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                        "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                                    },
                                    data:{
                                        "profilePic": params.ratingsGivenBy.profilePic,
                                        "userID": params.ratingsGivenBy.userID,
                                        "postID": params.postID,
                                        "bookingID": params.bookingID,
                                        "type": "Ratings",
                                    }
                                }
                                Notifications.sendNotifications(params.ratingsGivenTo.userID,data);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Ratings sent successfully to customers"
                                    }
                                });
                                return;
                            })                            
                        } else {
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Ratings sent failed to customers"
                                }
                            });
    
                        }
                    });
                }else{
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Ratings already given to this customers"
                        }
                    });
                }               
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with this booking ID"
                    }
                });
            }
        })

    }
};

module.exports = FeedBackToCustomer;