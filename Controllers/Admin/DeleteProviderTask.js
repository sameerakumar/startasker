const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');

var providerDeletetask = {

    providertaskdelete:(params,callback)=>{
        const {error} = paramValidator.validateTaskDeleteParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }

        let deleteQuery = dbQueries.deletetaskQuery(params);
        deleteQuery.then((found)=>{
            if(found){
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Provider Task Deleted successfully"
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

module.exports = providerDeletetask;