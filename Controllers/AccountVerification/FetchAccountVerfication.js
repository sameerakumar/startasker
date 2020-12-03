const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AccountVerificationParamValidations');
const dbQueries = require('./AccountVerificationDBQueries');

var FetchAccountVerificationData = {

    fetch : (params,callback) =>{
        const {error} = paramValidator.validateFetchAccountParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchQuery = dbQueries.getDataQuery(params);
        fetchQuery.then((found)=>{
            if(found){
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "User account details fetched successfully",
                        accountData : found
                    }
                });
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with this id"
                    }
                });
            }
        })
    }
}

module.exports = FetchAccountVerificationData;