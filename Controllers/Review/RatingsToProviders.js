const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./ReviewParamValidations');
const dbQueries = require('./ReviewDBQueries');
const bookingDbQueries = require('../Bookings/BookingsDBQueries');
const Notifications = require('../Core/Notifications');

var Review = {
    review: (params, callback) => {
        const { error } = paramValidator.validateProviderRatingsParams(params);
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
                var ratingsToProvider = false;
                var bookedTaskers = found.bookedTaskers;
                for (var i = 0; i < bookedTaskers.length; i++) {
                    var userID = bookedTaskers[i].offeredUserID;
                    if (userID === params.ratingsGivenTo.userID) {
                        ratingsToProvider = bookedTaskers[i].ratingsToProvider;
                    }
                }
                if (ratingsToProvider == false) {
                    let ReviewQuery = dbQueries.ratingsToProviderQuery(params);
                    ReviewQuery.save((Found) => {
                        //console.log('found', Found);
                        if (!Found) {
                            let updateQuery = dbQueries.updateCustomerRatingsToProvider(params);
                            updateQuery.then((saved) => {
                                console.log('data saved...', saved);
                                var data = {
                                    notification: {
                                        "title": "StarTasker",
                                        "body": params.ratingsGivenBy.name + " poster has given ratings to you for the completed task " + params.postTitle,
                                        "sound": "default",
                                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                        "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                                    },
                                    data: {
                                        "profilePic": params.ratingsGivenBy.profilePic,
                                        "userID": params.ratingsGivenBy.userID,
                                        "postID": params.postID,
                                        "bookingID": params.bookingID,
                                        "type": "Ratings",
                                    }
                                }
                                Notifications.sendNotifications(params.ratingsGivenTo.userID, data);
                                let getRatingQuery = dbQueries.fetchReviewsByUserID(params.ratingsGivenTo.userID);
                                getRatingQuery.then((found) => {
                                    if (found) {
                                        var ratings = 0;
                                        var count = 0;
                                        var totalAverageRating = 0.0;                                        
                                        console.log('found',found)
                                        if (found.length != 0) {
                                            for (var i = 0; i < found.length; i++) {
                                                if (found[i].ratingsAsAProvider != "" && !found[i].ratingsAsAPoster) {
                                                    count = count + 1
                                                    ratings += parseFloat(found[i].ratingsAsAProvider);
                                                    console.log('total ratings...', ratings);
                                                }
                                            }
                                            totalAverageRating = ratings / count;
                                            console.log('average..', totalAverageRating);
                                        }
                                        let updateRatingsToProvider = dbQueries.updateProviderRatingsToOffersQuery(params, totalAverageRating);
                                        updateRatingsToProvider.then((updated) => {
                                            console.log('updated rating every where successfully...', updated);
                                        })
                                    }
                                })
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Ratings sent successfully to provider"
                                    }
                                });
                                return;
                            })
                        } else {
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Ratings sent failed to provider"
                                }
                            });

                        }
                    });
                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Ratings already given to this provider"
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

module.exports = Review;