const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
var paramValidator = require('./CustomerParamsValidation');
var dbQueries = require('./CustomerDBQueries');

var updateCustomerSearchConfig = {

    updateSearchConfigurations: (params, callback) => {
        const { error } = paramValidator.validateSearchConfigurationParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        var jobsCount = 0;
        let getJobsCountQuery = dbQueries.fetchTotalJobCountQuery(params);
        getJobsCountQuery.then((dbCount) => {
            jobsCount = dbCount;
            console.log('db count...',jobsCount)
        let getCustomerWithId = dbQueries.getUserQueryFromUserId(params.userID);
        getCustomerWithId.then((isFound) => {
            if (isFound) {
                let update = dbQueries.getUpdateCustomerSearchConfig(params);
                update.then((isUpdated) => {
                    if (isUpdated) {
                        let getData = dbQueries.getJobsBasedOnCustomerSearchConfig(params);
                        getData.then((found) => {
                            if (found) {
                                //console.log('post jobs length...', found);
                                if (found.length === 0) {
                                    callback({
                                        status: 200,
                                        data: {
                                            response: statusCodes.success,
                                            message: "Mathed data fetched successfully",
                                            jobsData: found,
                                            totalPageCount: jobsCount
                                        }
                                    });
                                    return;
                                } else {
                                    console.log('entered into else....');
                                    var userID;
                                    var array = [];
                                    var posts = JSON.parse(JSON.stringify(found));
                                    //console.log('post length...',posts.length);
                                    for (var j = 0; j < posts.length; j++) {
                                        var post = posts[j];
                                        if (!array.includes(post.userID)) {
                                            array.push(post.userID);
                                        }
                                    }
                                    let getallcustomers = dbQueries.getAllCustomersQuery(array);
                                    getallcustomers.then((users) => {
                                        //console.log('all users...',users);
                                        for (var k = 0; k < posts.length; k++) {
                                            var post1 = posts[k];
                                            //console.log('user id..',post1.userID);
                                            post1.userInfo = getUserInfo(users, post1.userID);
                                            //console.log('get user info...',post.userInfo);
                                            posts[k] = post1;

                                        }
                                        var totalPages = Math.ceil(jobsCount / params.size)
                                        return callback({
                                            status: 200,
                                            data: {
                                                response: statusCodes.success,
                                                message: "Mathed data fetched successfully",
                                                jobsData: posts,
                                                totalPageCount: totalPages
                                            }
                                        })
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
                })
            } else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found. Please register with us"
                    }
                });
                return;
            }
        });
    });
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


module.exports = updateCustomerSearchConfig;