const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');

var fetchTasks = {

    fetchtask: (params, callback) => {
        const {error} = paramValidator.validateTaskParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }

        var chkFromDate = params.hasOwnProperty('fromdate');
        var chkToDate = params.hasOwnProperty('todate');
        console.log("check", chkFromDate && chkToDate)
        if (chkFromDate && chkToDate) {
            let fetchQuery = dbQueries.fetchTaskerQuery(params, true);
            fetchQuery.then((found) => {
                    if (found) {
                        let Query = dbQueries.postjobscountQuery(params,true);
                        Query.then((countdata) => {
                            console.log("count", 2 / 2)
                            var pageNumber = parseInt(params.pageNo);
                            var nPerPage = parseInt(params.size);
                            totalPages = Math.ceil(countdata / nPerPage);
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Tasks fetched successfully",
                                    jobsData: found,
                                    pages:totalPages
                                }
                            });
                        });
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "No Found Data"
                            }
                        });
                    }
                })
        } else {
            let fetchQuery = dbQueries.fetchTaskerQuery(params, false);
            fetchQuery.then((found) => {
                if (found) {
                    let Query = dbQueries.postjobscountQuery(params,false);
                    Query.then((countdata) => {
                        console.log("count", 2 / 2)
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size);

                        totalPages = Math.ceil(countdata / nPerPage);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Tasks fetched successfully",
                                jobsData: found,
                                pages:totalPages
                            }
                        });
                    });
                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "No Found Data"
                        }
                    });
                }
            })


        }
    }

}

module.exports = fetchTasks;