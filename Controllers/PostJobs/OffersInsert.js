const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const RatingsQuery = require('../Review/ReviewDBQueries');
const Notifications = require('../Core/Notifications');

var AddOfferToPost = {
    addOffer: (params, callback) => {
        const { error } = paramValidations.validateAddOffersToPostJobsParams(params);
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
        let Query = dbQueries.getPostJobQueryFromPostId(params.postID);
        Query.then((isFound) => {
            if (isFound) {
                if (isFound.userID === params.offeredUserID) {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Posted job user can not do make an offer"
                        }
                    });
                    return;
                } else {
                    var count = isFound.jobAppliedCount + 1;
                    var found = false;
                    for (var i = 0; i < isFound.offers.length; i++) {
                        var authoremail = isFound.offers[i].offeredUserID;
                        if(authoremail === params.offeredUserID){
                            found = true;
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "You already applied for this job"
                                }
                            });
                            return;
                        }
                        break;
                        //console.log("isFound",authoremail);
                    }
                    if (found === false) {
                        return getProviderRatingsAverage(params, count, isFound, callback);
                    } 
                }
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No job data Found"
                    }
                });
                return;
            }
        })
    },
    replayToOfferMessage: (params, callback) => {
        const { error } = paramValidations.validateReplayToOfferMessages(params);
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
        let Query = dbQueries.getPostJobQueryFromPostId(params.postID);
        Query.then((isFound) => {
            if (isFound) {                
                if(params.userID != params.offeredUserID){
                    var userFound = false;
                    for (var i = 0; i < isFound.offers.length; i++) {                                        
                    if (isFound.offers[i].offeredUserID === params.offeredUserID) {
                        userFound = true;
                        let replayQuery = dbQueries.getGivingReplayToOfferMessageQuery(params);
                        replayQuery.then((success) => {
                        //console.log('error..',err);
                        if (success) {
                            var data = {
                                notification: {
                                    "title": "Offer replay from " + params.name,
                                    "body": params.message,
                                    "sound": "default",
                                    "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                    "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                                },
                                data: {
                                    "profilePic": params.profilePic,
                                    "userID": isFound.userID,
                                    "postID": params.postID,
                                    "type": "OfferReplayToProvider"
                                }
                            }
                            Notifications.sendNotifications(params.offeredUserID, data);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Message send successfully"
                                }
                            });
                            return;
                        }
                    })                        
                    }
                    break;
                    }                    
                }else{
                    var userFound = false;
                    for (var i = 0; i < isFound.offers.length; i++) {
                    if (isFound.offers[i].offeredUserID === params.offeredUserID) {
                        userFound = true;
                        let replayQuery = dbQueries.getGivingReplayToOfferMessageQuery(params);
                        replayQuery.then((success) => {
                        //console.log('error..',err);
                        if (success) {
                            var data = {
                                notification: {
                                    "title": "Offer replay from " + params.name,
                                    "body": params.message,
                                    "sound": "default",
                                    "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                    "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                                },
                                data: {
                                    "profilePic": params.profilePic,
                                    "userID": params.offeredUserID,
                                    "postID": params.postID,
                                    "type": "OfferReplayToCustomer"
                                }
                            }
                            Notifications.sendNotifications(isFound.userID, data);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Message send successfully"
                                }
                            });
                            return;
                        }
                    })
                    }
                    break;
                    }                    
                }                
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No job data Found"
                    }
                });
                return;
            }
        })
    }
}

function getProviderRatingsAverage(params, jobappliedcount, user, callback) {
    console.log('posted job user id...', user.userID);
    let getRatingQuery = RatingsQuery.fetchReviewsByUserID(params.offeredUserID);
    getRatingQuery.then((found) => {
        if (found) {
            var ratings = 0;
            var count = 0;
            var totalAverageRating = 0.0;
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
			/*let updateRatingsToProvider = dbQueries.updateProviderRatingsToOffersQuery(params,totalAverageRating);
            updateRatingsToProvider.then((updated)=>{
                console.log('updated rating every where successfully...',updated);
            }) */
            let addOfferQuery = dbQueries.getOfferQuery(params, totalAverageRating);
            addOfferQuery.then((saved) => {
                console.log('data saved...')
                let Updatequery = dbQueries.getUpdateJobAppliedCount(params, jobappliedcount);
                Updatequery.then((err) => {
                    if (!err) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Adding offer to postjob is failed"
                            }
                        });
                        return;
                    } else {
                        var data = {
                            notification: {
                                "title": "New offer from " + params.authorName,
                                "body": params.message,
                                "sound": "default",
                                "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                            },
                            data: {
                                "budget": params.budget + " RM",
                                "profilePic": params.authorProfilePic,
                                "userID": params.offeredUserID,
                                "postID": params.postID,
                                "type": "Offer"
                            }
                        }
                        Notifications.sendNotifications(user.userID, data);
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Adding offer to postjob is success"
                            }

                        });
                        return;
                    }
                })
            })
        }

    })

}


module.exports = AddOfferToPost;