const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');
var taskDelete = {

    taskdelete: (params, callback) => {
        const {error} = paramValidator.TaskerParams(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return
        }


        let Query = dbQueries.getTaskQuery(params);
        Query.then((data) => {
            console.log("data",data)
            if (data) {
                let postQuery = dbQueries.getbookingQuery(params);
                postQuery.then((found) => {
                    console.log("data2",found)
                    if (found) {
                        let inboxQuery = dbQueries.getInboxQuery(params);
                        inboxQuery.then((Inboxdata) => {
                            console.log('offeruserid...', Inboxdata);

                            console.log("data3", Inboxdata)
                            const deleteQuery = dbQueries.deletedQuery(params, params.postID);
                            deleteQuery.then((deleted) => {
                                console.log("datatask1",deleted)
                                const deleteQuery = dbQueries.deleteBookingQuery(params, params.postID);
                                deleteQuery.then((deleted) => {
                                    const deleteQuery = dbQueries.deleteinboxQuery(params, params.postID);
                                    deleteQuery.then((deleted) => {
                                        if (deleted) {
                                            return callback({
                                                status: 200,
                                                data: {
                                                    response: statusCodes.success,
                                                    message: " Task has been delete successfully"
                                                }
                                            });

                                        } else {
                                            return callback({
                                                status: 200,
                                                data: {
                                                    response: statusCodes.failure,
                                                    message: " Task delete has been failed"
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    }
                    else {
                        const deleteQuery = dbQueries.deletedQuery(params, params.postID);
                        deleteQuery.then((deleted) => {
                            console.log("datatask1",deleted)
                            if (deleted) {
                                callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: " Task has been delete successfully"
                                    }
                                });
                                return;
                            }
                        })
                    }
                })

            } else {
                    const deleteQuery = dbQueries.deleteinboxQuery(params, params.postID);
                    deleteQuery.then((deleted) => {
                        console.log("datatask2",deleted)
                        const deleteQuery = dbQueries.deleteBookingQuery(params, params.postID);
                        deleteQuery.then((deleted) => {
                            console.log("datatask",deleted)
                            if (deleted) {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: " Task2 has been delete successfully"
                                    }
                                });

                            } else {
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: " Task delete has been failed"
                                    }
                                });
                            }
                        })

                    })
                }
        })
    }
}



module.exports = taskDelete;