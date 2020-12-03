const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');

var customerFetch = {
    fetch: (params,callback) =>{
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
        let getCustomerWithId = dbQueries.getUserQueryFromUserId(params.userID);
        getCustomerWithId.then((isFound) => {
            if(isFound){
                let aggregateQuery = dbQueries.getAggreateQuery(isFound.userID);
                aggregateQuery.then((settings) =>{
                    if(settings){
                        return callback({ 
                            status: 200, 
                            data: { 
                                response: statusCodes.success, 
                                message: "Customer info fetched successfully" ,
                                customerInfo: settings,

                            } 
                        });
                    }
                })
              
            }else{
                return callback({ 
                    status: 200, 
                    data: { 
                        response: statusCodes.failure, 
                        message: "Customer info fetched failed" ,
                        customerInfo: []
                    } 
                });
            }
           
        });

    }
}

module.exports = customerFetch;