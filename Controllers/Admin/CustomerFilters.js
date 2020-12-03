const dbQueries =  require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./AdminParamvalidations');

var filterUsers = {

    filterStatus: (params,callback) => {
        const {error} = paramValidations.validatefilteParams(params);
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
        console.log("check",chkFromDate && chkToDate)
        if(chkFromDate && chkToDate) {
            let fetchQuery = dbQueries.findfilterQuery(params,true);
            fetchQuery.then((found) => {
                //console.log("found", found)
                if (found) {
                    let Query = dbQueries.countQuery(params,true);
                    Query.then((countdata) => {
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size)

                        totalPages = Math.ceil(countdata / nPerPage);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Users fetched successfully",
                                FetchData: found,
                                pages: totalPages
                            }
                        });
                    })

                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "No Found Data"
                        }
                    });
                }
            });
        }else{
            let fetchQuery = dbQueries.findfilterQuery(params,false);
            fetchQuery.then((found) => {
                //console.log("falsfound", found)
                if (found) {
                    let Query = dbQueries.countQuery(params,false);
                    Query.then((countdata) => {
                        console.log("count", countdata)
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size);


                        totalPages = Math.ceil(countdata / nPerPage)-pageNumber;
                        console.log("daqt", totalPages)
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Users fetched successfully",
                            FetchData: found,
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
            });
        }
    }
};

module.exports = filterUsers;