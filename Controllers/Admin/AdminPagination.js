const dbQueries =  require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./AdminParamvalidations');

var FetchPagination = {

    pagination: (params,callback) => {

        const {error} = paramValidations.validatepagination(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }


        var totalcount;
        let CustomerDetailsData = dbQueries.countQuery(params);
        CustomerDetailsData.then((countdata) => {
            totalcount = countdata;
            if(!countdata){
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "invalid "

                    }
                });
                return;
            }
        });

        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        console.log()
        if (pageNumber < 0 || pageNumber === 0) {
            callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: "invalid page number, should start with 1"

                }
            });
            return;

            // response = {"error": true, "message": "invalid page number, should start with 1"};

        }
        else {
            let CustomerDetailsData = dbQueries.getCustomerDetails(params);
            CustomerDetailsData.then((foundData) => {
                if (foundData) {
                    var totalPages = Math.ceil(totalcount / nPerPage)
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: foundData,
                            pages: totalPages
                        }
                    })
                }
                else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Data not found from DB"
                        }
                    })
                }
            }).catch((error) => {
                console.log(error);
            })

        }
    }
}

module.exports = FetchPagination;