const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const Notifications = require('../Core/Notifications');

var OfferUpdateController = {
    updateOffers: (params, callback) => {
        const { error } = paramValidations.validateOfferUpdateParams(params);
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
        let getPostQuery = dbQueries.getPostJobQueryFromPostId(params.postID);
        getPostQuery.then((ifFound) => {
            if (ifFound) {
                var offeredName;
                var offeredProfilePic;
                for (var i = 0; i < ifFound.offers.length; i++) {
                    var isFound = false;
                    if (ifFound.offers[i].offeredUserID === params.offeredUserID) {
                        isFound = true;
                        var offeredName = ifFound.offers[i].authorName;
                        var offeredProfilePic = ifFound.offers[i].authorProfilePic;
                        let updateOfferQuery = dbQueries.updateOffersDataQuery(params);
                        updateOfferQuery.then((err) => {
                            if (!err) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "Offer update failed"
                                    }
                                });
                                return;
                            } else {
                                var data = {
                                    notification: {
                                        "title": offeredName + " has been updated offer",
                                        "body": params.message,
                                        "sound": "default",
                                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                        "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                                    },
                                    data: {
                                        "budget": params.budget + " RM",
                                        "profilePic": offeredProfilePic,
                                        "userID": params.offeredUserID,
                                        "postID": params.postID,
                                        "type": "OfferUpdate"
                                    }
                                }
                                Notifications.sendNotifications(ifFound.userID, data);
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Offer update successfully"
                                    }
                                });
                                return;
                            }

                        })
                        break;
                    }
                }
                if(isFound == false){
                     callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Your not offered to this post to update offer"
                                }
                            });
                            return;
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
module.exports = OfferUpdateController;