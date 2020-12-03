const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const statusCodes = require('../Core/StatusCodes');

var customerCheckAvailability = {

    checkUserName: (params,callback) =>{
        const { error } = paramValidations.validateSearchingUserWithUserNameParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let loginQuery = dbQueries.getUserFromUserFirstName(params.userName);
        loginQuery.then((user) => {
            if(!user){
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "User is not available"
                    }
                });       
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "User data available",
                        customerData:user
                    }
                });        
            }
        });
            
    }
}

module.exports = customerCheckAvailability;