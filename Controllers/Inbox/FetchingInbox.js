const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./InboxParametersValidations');
const dbQueries = require('./InboxDbQuery');

var InboxController = {

    fetchInbox: (params,callback) =>{
        const { error } = paramValidations.validateFeFetchingInboxParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchInboxQuery = dbQueries.getCustomerInboxQuery(params);
        fetchInboxQuery.then((found)=>{
            if(found){
                return callback({ 
                    status: 200, 
                    data: { 
                        response: statusCodes.success, 
                        message: "Inbox fetched successfully",
                        customerInbox: found,

                    } 
                });
            }else{
                return callback({ 
                    status: 200, 
                    data: { 
                        response: statusCodes.failure, 
                        message: "Inbox fethed failed"

                    } 
                });
            }
        })
    }
}
module.exports = InboxController;