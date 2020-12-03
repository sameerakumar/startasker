const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const RandomOTP = require('../Core/GenerateOTP');
const paramValidations = require('./TaskParamValidations');
const dbQueries = require('./TaskDBQueries');
const Mailer = require('../Core/Mailer');

var reportTask = {
    task: (params, callback) => {
        const { error } = paramValidations.validateinsertParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }

                let insertQuery = dbQueries.InsertQuery(params);
                insertQuery.save((insert_record) => {
                    if (insert_record) {
                        Mailer.userReportTaskSentToMail("Message", params.message);
                        callback({ status: 200, data: { response: statusCodes.success, message: "Message sent to registered mail" } });
                        return;
                    } else {
                        callback({ status: 200, data: { response: statusCodes.failure, message: "Message sending failed" } });
                        return;
                    }
                }).catch((error) => {
                    console.log(error);
                })


    }

}

module.exports = reportTask;