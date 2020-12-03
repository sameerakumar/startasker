const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const GenerateID = require('../Core/IDGenerate');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');

var customerSettings = {

    updateSkills: (params, callback) => {
        const { error } = paramValidations.validateCustomerSkillsUpdateParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getUserQueryFromUserId(params.userID);
        fetchUser.then((found) => {
            if (!found) {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            } else {
                let fetchSettingsQuery = dbQueries.getCustomerSettingQuery(params);
                fetchSettingsQuery.then((settings_found) => {
                    if (settings_found) {
                        console.log('please update values to db...');                        
                        let updateQuery = dbQueries.getUpdateCustomerSkillsQuery(params);
                        updateQuery.then((updated) => {
                            if (updated.ok == 1) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer skills updated successfully"
                                    }
                                });
                                return;
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Customer skills failed to update"
                                }
                            });
                            return;
                        })
                    }
                })
            }

        })
    },

    updateTaksAlert:(params,callback) =>{
        const { error } = paramValidations.validateCustomerTaskAlertsUpdateParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getUserQueryFromUserId(params.userID);
        fetchUser.then((found) => {
            if (!found) {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            } else {
                let fetchSettingsQuery = dbQueries.getCustomerSettingQuery(params);
                fetchSettingsQuery.then((settings_found) => {
                    if (settings_found) {
                        console.log('please update values to db...');
                        let updateQuery = dbQueries.getUpdateCustomerTaskAlertQuery(params);
                        updateQuery.then((updated) => {
                            if (updated.ok == 1) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer task alert updated successfully"
                                    }
                                });
                                return;
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Customer task alert failed to update"
                                }
                            });
                            return;
                        })
                    }
                });
            }

        });
    },

    addCustomeAlert: (params,callback) =>{
        const { error } = paramValidations.validateAddCustomerCustomTaskAlertsParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getUserQueryFromUserId(params.userID);
        fetchUser.then((found) => {
            if (!found) {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            } else {
                let fetchSettingsQuery = dbQueries.getCustomerSettingQuery(params);
                fetchSettingsQuery.then((settings_found) => {
                    if (settings_found) {
                        console.log('please update values to db...');
                        var alertID = GenerateID.makeId();
                        let updateQuery = dbQueries.getInsertCustomerCustomAlertsQuery(params,alertID);
                        updateQuery.then((updated) => {
                            if (updated.ok == 1) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Custom task alert inserted successfully",
                                        alertID: alertID
                                    }
                                });
                                return;
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Custom task alerts failed to insert"
                                }
                            });
                            return;
                        })
                    }
                })
            }
        });
    },
    updateCustomeAlert: (params,callback) =>{
        const { error } = paramValidations.validateUpdateCustomerCustomTaskAlertsParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getUserQueryFromUserId(params.userID);
        fetchUser.then((found) => {
            if (!found) {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            } else {
                let fetchSettingsQuery = dbQueries.getCustomerSettingQuery(params);
                fetchSettingsQuery.then((settings_found) => {
                    if (settings_found) {
                        console.log('please update values to db...');
                        //var alertID = GenerateID.makeId();
                        let updateQuery = dbQueries.updateCustomerCustomAlertsQuery(params);
                        updateQuery.then((updated) => {
                            if (updated.ok == 1) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Custom task alert updated successfully"
                                    }
                                });
                                return;
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Custom task alerts failed to update"
                                }
                            });
                            return;
                        })
                    }
                })
            }
        });
    },
    deleteCustomAlert:(params,callback) => {
        const { error } = paramValidations.validateDeleteCustomerCustomTaskAlertsParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getUserQueryFromUserId(params.userID);
        fetchUser.then((found) => {
            if (!found) {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            } else {
                let fetchSettingsQuery = dbQueries.getCustomerSettingQuery(params);
                fetchSettingsQuery.then((settings_found) => {
                    if (settings_found) {
                        let deleteQuery = dbQueries.getDeleteCustomTaskAlert(params);
                        deleteQuery.then((isDeleted) => {
                            if (isDeleted) {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Custom alert deleted successfully"
                                    }
                                });
                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: "Custom alert delete failed"
                                    }
                                });
                            }
                        })
                    }else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Custom alert not found to delete"
                            }
                        });
                    }
                })
            }
        });
    },

    updateCustomNotifications: (params, callback) =>{
        const { error } = paramValidations.validateUpdateCustomerNotificationsParameters(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchUser = dbQueries.getUserQueryFromUserId(params.userID);
        fetchUser.then((found) => {
            if (!found) {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found. Please register with us." } });
                return;
            } else {
                let fetchSettingsQuery = dbQueries.getCustomerSettingQuery(params);
                fetchSettingsQuery.then((settings_found) => {
                    if (settings_found) {
                        let updateQuery = dbQueries.getUpdateCustomerNotificationsQuery(params);
                        updateQuery.then((updated) => {
                            if (updated.ok == 1) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Customer notifications updated successfully"
                                    }
                                });
                                return;
                            }
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Customer notifications failed to update"
                                }
                            });
                            return;
                        })
                    }else{
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Customer notifications not found to update"
                            }
                        });
                        return;
                    }
                })
            }
        })
    }
}

module.exports = customerSettings;