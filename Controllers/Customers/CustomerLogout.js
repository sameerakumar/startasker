const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');

var UserLogoutController = {

    sessionOut:(params,callback)=>{
        const { error } = paramValidations.validateUserLogoutParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
            let sessionOutQuery = dbQueries.logoutUserFromDeviceQuery(params);
            sessionOutQuery.then((updated)=>{
                if(updated){
                    console.log(updated);
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "You have been successfully logged out"
                        }
                    });
                    return;
                                   
                }else{
                   // console.log(err);
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "You have falied to logged out"
                        }
                    });
                    return; 
                }
            })
        
    }
}

module.exports = UserLogoutController;