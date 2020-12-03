const dbQueries =  require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidator = require('./AdminParamvalidations');
var FetchAllbookings = {

    bookingsFetch: (params,callback) => {
        const {error} = paramValidator.filterBookingsParams(params);
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
            let fetchQuery = dbQueries.fetchBookingsQuery(params,true);
            fetchQuery.then((found) => {

                if (found) {
                    let countquery = dbQueries.bookingscountQueryy(params,true);
                    countquery.then((countdata) => {
                        console.log("count", 2 / 2)
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size);

                        var totalPages = Math.ceil(countdata / nPerPage);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Bookings fetched successfully",
                                FetchData: found,
                                pages: totalPages
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
        }else{
            let fetchQuery = dbQueries.fetchBookingsQuery(params,false);
            fetchQuery.then((found) => {
                console.log("found", found)
                if (found) {
                    let countquery = dbQueries.bookingscountQueryy(params,false);
                    countquery.then((countdata) => {
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size);

                        var totalPages = Math.ceil(countdata / nPerPage);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Bookings fetched successfully",
                                FetchData: found,
                                pages:totalPages
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
        }
    }
}
    module.exports = FetchAllbookings;