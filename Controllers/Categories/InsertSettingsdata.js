const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CategoriesParamValidations');
const dbQueries = require('./CategoriesDBQueries');



var addamount = {
    amountdata: (params, callback) => {
        const {error} = paramValidator.validateamountparams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }

                let Query = dbQueries.insertQuery(params);
                Query.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Settings Amountdata Insert successfully"
                            }
                        });
                        return;
                    }
                });
    }
};

module.exports = addamount;