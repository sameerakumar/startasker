const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./FeedBackParamValidations');
const dbQueries = require('./FeedBackDBQueries');

var Delete = {

    delete: (params, callback) => {
        const { error } = paramValidator.validateDeleteParams(params);
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
        let get_Query = dbQueries.getFeedBackQuery(params);
        get_Query.then((found) => {
            console.log("found",found);
            if(found){

                const deleteQuery = dbQueries.deleteQuery(customerID);
                deleteQuery.then((deleted) => {
                    if (deleted) {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Feedback has been delete successfully"
                            }
                        });
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Feedback delete has been failed"
                            }
                        });
                    }
                })

            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with us"
                    }
                });
            }
        })
    }
};

module.exports = Delete;