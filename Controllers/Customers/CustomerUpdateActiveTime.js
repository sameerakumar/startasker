const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');

var CustomerUpdateActiveTime = {
    
     updateActiveTime:(params,callback)=>{
        const { error } = paramValidator.validateUpdateUserActiveTimeStamp(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getCustomerQuery(params);
        fetchUser.then((found)=>{
            if(found){
                let updateQuery = dbQueries.updateCustomerActiveTimeStampQuery(params);
                updateQuery.then((updated)=>{
                    if(updated){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Active time updated successfully"
                            }
                        });
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Active time update failed"
                            }
                        });
                    }
                })
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No user found with this id"
                    }
                });
            }
        })
     }

}

module.exports = CustomerUpdateActiveTime;