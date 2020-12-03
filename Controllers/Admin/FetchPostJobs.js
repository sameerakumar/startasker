const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');

var fetchPostJobs = {

    fetchpostjobs:(params,callback)=>{
        const {error} = paramValidator.validateDeleteParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let fetchQuery = dbQueries.FetchpostjobQuery(params);
        fetchQuery.then((found)=>{
            if(found){
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Postjobs fetched successfully",
                        jobsData: found
                    }
                });
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Found Data"
                    }
                });
            }
        })
    }

}

module.exports = fetchPostJobs;