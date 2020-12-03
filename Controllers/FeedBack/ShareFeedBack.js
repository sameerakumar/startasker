const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./FeedBackParamValidations');
const dbQueries = require('./FeedBackDBQueries');

var shareFeedBack = {
    feedback: (params, callback) => {
        const { error } = paramValidator.ValidateFeedBackParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let get_Query = dbQueries.getFeedBackQuery(params);
        get_Query.then((isFound) => {
            if (isFound) {
                console.log("isfound", !isFound);
                let feedbackQuery = dbQueries.insertQuery(params);
                feedbackQuery.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "FeedBack Insert successfully"
                            }
                        });
                        return;
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "FeedBack Insert failed"
                            }
                        });

                    }
                });
            }
            else {
                let feedbackQuery = dbQueries.insertQuery(params);
                feedbackQuery.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "FeedBack Insert successfully"
                            }
                        });
                        return;
                    }
                });
            }
        });
    }
};

module.exports = shareFeedBack;