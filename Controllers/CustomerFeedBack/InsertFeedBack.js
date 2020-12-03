const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./FeedBackParamValidations');
const dbQueries = require('./FeedBackDBQueries');
const GenerateID = require('../Core/IDGenerate');

var FeedBack = {
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
            let bookingID = 'Book' + GenerateID.makeId();
            if (isFound) {
                console.log("isfound", isFound);
                let feedbackQuery = dbQueries.insertQuery(params,bookingID);
                feedbackQuery.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "FeedBack Insert successfully",
                                bookingID:bookingID
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
                let feedbackQuery = dbQueries.insertQuery(params,bookingID);
                feedbackQuery.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "FeedBack Insert successfully",
                                bookingID:bookingID
                            }
                        });
                        return;
                    }
                });
            }
        });
    }
};

module.exports = FeedBack;