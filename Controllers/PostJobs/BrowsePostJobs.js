const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const custDbQueries = require('../Customers/CustomerDBQueries');

var BrowsePostJobs = {

    browseJob: (params, callback) => {
        const { error } = paramValidations.validateBroseJobParams(params);
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

        if (params.keyword != "" && params.location != "" && params.categories.length === 0) {
            //console.log('enterd into keyword..')
            let browseQuery = dbQueries.getBrowseJobQueryFromKeyword(params);
            browseQuery.then((ifFound) => {
                if (ifFound) {
                    //console.log('db data...', ifFound);
                    return getAllUserPost(ifFound, params, callback);
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Fetched data failed",
                            jobsData: []
                        }
                    });
                    return;
                }
            })
        }
         else if (params.keyword === "" && params.location === "" && params.categories.length === 0) {
        } 
        else if (params.keyword === "" && params.location != "" && params.categories.length === 0) {
            let browseQuery = dbQueries.getBrowseJobQueryFromLocation(params);
            browseQuery.then((ifFound) => {
                if (ifFound) {
                    return getAllUserPost(ifFound, params, callback);
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Fetched data failed",
                            jobsData: []
                        }
                    });
                    return;
                }
            })
        } 
        else if (params.keyword === "" && params.location != "" && params.categories.length > 0) {

            let browseQuery = dbQueries.getBrowseJobQueryFromCategory(params);
            browseQuery.then((ifFound) => {
                if (ifFound) {
                    return getAllUserPost(ifFound, params, callback);
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Fetched data failed",
                            jobsData: []
                        }
                    });
                    return;
                }
            })
        }
        else {
            let browseQuery = dbQueries.getBrowseJobQueryFromName(params);
            browseQuery.then((ifFound) => {
                if (ifFound) {
                    return getAllUserPost(ifFound, params, callback);
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Fetched data failed",
                            jobsData: []
                        }
                    });
                    return;
                }
            })
        }


    }

}
function getAllUserPost(found, params, callback) {
    var jobsCount = 0;
    let getPostJobsCountQuery = dbQueries.fetchTotalBrowseJobCountQuery(params);
    getPostJobsCountQuery.then((dbCount) => {
        jobsCount = dbCount;
        console.log('db job count...',jobsCount);
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
            //console.log('post data...',posts);
            for (var j = 0; j < posts.length; j++) {

                var post = posts[j];
                if (!array.includes(post.userID)) {
                    array.push(post.userID);
                }
            }
            let getallcustomers = custDbQueries.getAllCustomersQuery(array);
            getallcustomers.then((users) => {
                //console.log('all users...',users);
                for (var k = 0; k < posts.length; k++) {
                    var postStatus = posts[k].post_Status;
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
    });
}

function getUserInfo(users, userID) {
    for (var i = 0; i < users.length; i++) {
        //console.log('user id',users[i].userID);
        if (users[i].userID === userID) {
            return users[i];
        }
    }
}
module.exports = BrowsePostJobs;