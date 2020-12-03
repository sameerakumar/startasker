const dbQueries = require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./AdminParamvalidations');

var searching = {
    nameSearching: (params, callback) => {
        const { error } = paramValidations.customerParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchQuery = dbQueries.serachingQuery(params);
        fetchQuery.then((found) => {
            if (found) {
                let CustomerDetailsData = dbQueries.searchingcountQuery(params);
                CustomerDetailsData.then((countdata) => {
                    console.log("count", countdata);
                    var nPerPage = parseInt(params.size);
                    var totalPages = Math.ceil(countdata / nPerPage);
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Users fetched successfully",
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
    }
};

module.exports = searching;