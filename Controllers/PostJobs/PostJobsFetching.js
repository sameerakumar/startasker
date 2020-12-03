const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
var validator = require('validator');

var fetchPostJobs = {
    fetch: (params, callback) => {
        const { error } = paramValidations.validateFetchJobParams(params);
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
        if (validator.isEmail(params.userID)) {
            let fetchQuery = dbQueries.getPostJobQueryFromId(params);
            fetchQuery.then((ifFound) => {
                if (ifFound) {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Jobs fetched successfully",
                            jobsData: ifFound
                        }
                    });

                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Jobs fetched failed",
                            jobsData: ifFound
                        }
                    });
                }
            });
        } else {
            let fetchQuery = dbQueries.getPostJobAggregateQueryByPostID(params.userID);
            fetchQuery.then((ifFound) => {
                if (ifFound) {

                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Jobs fetched successfully",
                            jobsData: ifFound
                        }
                    });

                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Jobs fetched failed",
                            jobsData: ifFound
                        }
                    });
                }
            });
        }
    },
    fetchAllJobs: (params, callback) => {
        const { error } = paramValidations.valiadtePaginationParamsForFetchingPostjobsParams(params);
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
        let getPostJobsCountQuery = dbQueries.fetchTotalJobCountQuery(params);
        getPostJobsCountQuery.then((dbCount) => {
                let fetchQuery = dbQueries.getPostJobAggregateQuery(params);
                fetchQuery.then((found) => {
                    if (found) {
                        //console.log('aggregate data...',found);
                        var totalPages = Math.ceil(dbCount / params.size);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Jobs fetched successfully",
                                jobsData: found,
                                totalPageCount: totalPages
                            }
                        });
                    }
                })
        })
        // let fetchQuery = dbQueries.getAllPostJobsQuery();
        // fetchQuery.then((found) => {
        //    if(found){
        //     return callback({
        //         status: 200,
        //         data: {
        //             response: statusCodes.success,
        //             message: "Jobs fetched successfully",
        //             jobsData: found
        //         }
        //     });
        //    }
        // }).catch((error) => {
        //     console.log(error);
        // })
    },

    fetchOfferedPosts: (params, callback) => {
        const { error } = paramValidations.validateFetchJobParams(params);
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
        let usersOfferQuery = dbQueries.getUserTakenOtherOffers(params);
        usersOfferQuery.then((offerFound) => {
            if (offerFound) {
                //console.log('post jobs length...', found);
                if (offerFound.length === 0) {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Mathed data fetched successfully",
                            jobsData: offerFound
                        }
                    });
                    return;
                } else {
                    console.log('entered into else....');
                    var array = [];
                    var posts = JSON.parse(JSON.stringify(offerFound));
                    //console.log('post length...',posts.length);
                    for (var j = 0; j < posts.length; j++) {
                        var post = posts[j];
                        if (!array.includes(post.userID)) {
                            array.push(post.userID);
                        }
                    }
                    let getallcustomers = dbQueries.getPostedCustomersInfoQuery(array);
                    getallcustomers.then((users) => {
                        //console.log('all users...',users);
                        for (var k = 0; k < posts.length; k++) {
                            var post1 = posts[k];
                            //console.log('user id..',post1.userID);
                            post1.userInfo = getUserInfo(users, post1.userID);
                            //console.log('get user info...',post.userInfo);
                            posts[k] = post1;

                        }
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Offered posts fetched successfully",
                                jobsData: posts
                            }
                        });
                    })
                }
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Mathed data not found",
                        //jobsData: found
                    }
                });
                return;
            }

        })


    }
}
function getUserInfo(users, userID) {
    for (var i = 0; i < users.length; i++) {
        //console.log('user id',users[i].userID);
        if (users[i].userID === userID) {
            return users[i];
        }
    }
}

module.exports = fetchPostJobs;