const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const Notifications = require('../Core/Notifications');

var OfferCancelController = {

    OfferCancel: (params, callback) => {
        const { error } = paramValidations.validateOfferCancelParams(params);
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
                var boolean = false;
                for (var i = 0; i < ifFound.offers.length; i++) {
                    if (ifFound.offers[i].offeredUserID === params.offeredUserID) {
                        boolean = true;
                        var offeredName = ifFound.offers[i].authorName;
                        var offeredProfilePic = ifFound.offers[i].authorProfilePic;
                        if (ifFound.jobAppliedCount > 0) {
                            let updateOfferQuery = dbQueries.cancelOfferDataQuery(params);
                            updateOfferQuery.then((success) => {
                                if (success) {
                                    var count = ifFound.jobAppliedCount - 1;
                                    let updateCountQuery = dbQueries.getUpdateJobAppliedCount(params, count);
                                    var data = {
                                        notification: {
                                            "title": "StarTasker",
                                            "body": offeredName + " offer has been canceled for your post " + ifFound.postTitle,
                                            "sound": "default",
                                            "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                            "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                                        },
                                        data: {
                                            "profilePic": offeredProfilePic,
                                            "userID": params.offeredUserID,
                                            "postID": params.postID,
                                            "type": "Offer",
                                        }
                                    }
                                    Notifications.sendNotifications(ifFound.userID, data);
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.success,
                                            message: "Offer delete successfully"
                                        }
                                    });
                                    return;
                                } else {
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.failure,
                                            message: "Offer delete failed"
                                        }
                                    });
                                    return;
                                }
                            })
                        } else {
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "No offers available to delete"
                                }
                            });
                            return;
                        }
                        break;
                    }
                }

            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with this ID"
                    }
                });
                return;
            }
        });
    }

}

module.exports = OfferCancelController;