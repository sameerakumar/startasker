const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');

var fetchDeletetask = {

    commentdelete:(params,callback)=>{
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

        let deleteQuery = dbQueries.deletecommentQuery(params);
        deleteQuery.then((found)=>{
            if(found){
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Comment Deleted successfully"
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

module.exports = fetchDeletetask;