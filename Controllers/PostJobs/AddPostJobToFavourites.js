const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');

var addJobToFavourites = {

    addToFavourite: (params,callback) =>{
        const { error } = paramValidations.validateAddToFavouriteJobParams(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return;
        }

        let fetchJob = dbQueries.getPostJobQueryFromPostId(params.postId);
        fetchJob.then((isFound) => {
            if(isFound){
                let updateQuery = dbQueries.getAddPostToFavouriteQuery(params.postId,params.favourite);
                updateQuery.then((update) => {
                    if(update.ok == 1){
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Job added to favourties successfully"
                            }
                        });
                        return;
                    }else{
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Job failed to add favourites"
                            }
                        });
                        return;
                    }
                })
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with this post"
                    }
                });
                return;
            }
        })
    }
}

module.exports = addJobToFavourites;