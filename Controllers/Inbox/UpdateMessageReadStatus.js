const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./InboxParametersValidations');
const dbQueries = require('./InboxDbQuery');

var UpdateUnReadMessageStatus = {
    updateMessageStatusByItsID:(params,callback)=>{
        const {error} = paramValidator.validateDeleteNotificationByItsIDParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchNotification = dbQueries.getNotificationByItsID(params);
        fetchNotification.then((found)=>{
            if(found){
                //console.log('found data...',found);
                let updateMessageStatusQuery = dbQueries.updateNotificationReadStatusByItsIDQuery(params);
                updateMessageStatusQuery.then((success)=>{
                    if(success){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Notification updated successfully"
                            }
                        });
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Notification update failed"
                            }
                        });
                    }
                })
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with this notifyID"
                    }
                });
            }
        })
    }
}
module.exports = UpdateUnReadMessageStatus;