const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');

var deleteAccount = {
    
    deleteMyAccount: (params,callback) => {
        const { error } = paramValidations.validateForgotPasswordParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let getAccountQuery = dbQueries.getUserQueryFromUserId(params.userID);
        getAccountQuery.then((isFound) => {
            if(isFound){
                let deleteQuery = dbQueries.getCustomersDeleteQuery(params.userID);
                deleteQuery.then((isDeleted) => {
                    if(isDeleted){
                        callback({ status: 200, data: { response: statusCodes.success, message: "Customer account deleted successfully" } });
                                return;
                    }else{
                        callback({ status: 200, data: { response: statusCodes.failure, message: "Customer account delete failed" } });
                                return;
                    }
                })
            }else{
                callback({ status: 200, data: { response: statusCodes.failure, message: "Customer not found with this Id" } });
                                return;
            }
        })

    }
}

module.exports = deleteAccount;