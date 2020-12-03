const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./InboxParametersValidations');
const dbQueries = require('./InboxDbQuery');

var DeleteNotificationController = {
    deleteByNotifyID:(params,callback) =>{
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
                console.log('found data...',found);
                let deleteQuery = dbQueries.deleteNotificationByItsIDQuery(params);
                deleteQuery.then((deleted)=>{
                    if(deleted){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Notification deleted successfully"
                            }
                        });
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Notification deleted failed"
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
    },
    deleteAllNotifications:(params,callback)=>{
        const {error} = paramValidator.validateAllDeleteNotificationParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchNotification = dbQueries.getCustomerInboxQuery(params);
        fetchNotification.then((found)=>{
            if(found){
                let deleteAllQuery = dbQueries.deleteAllNotificationQuery(params);
                deleteAllQuery.then((deleted)=>{
                    if(deleted){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Notifications deleted successfully"
                            }
                        });
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Notifications deleted failed"
                            }
                        });
                    }
                })
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found to delete with this user"
                    }
                });
            }   
        })
    }
}

module.exports = DeleteNotificationController;