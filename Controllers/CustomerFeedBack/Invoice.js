const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('./FeedBackParamValidations');
const dbQueries = require('./FeedBackDBQueries');
const Mailer = require('../Core/Mailer');

var Invoice = {
    invoiceData: (params, callback) => {
        const {error } = paramValidations.validateinsertParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }

        let insertQuery = dbQueries.InsertQuery(params.customerID);
        insertQuery.save((insert_record) => {
            if (insert_record) {
                Mailer.userInvoiceSentToMail("Invoice", params.invoice);
                callback({ status: 200, data: { response: statusCodes.success, message: "Invoice sent to registered mail" } });
                return;
            } else {
                callback({ status: 200, data: { response: statusCodes.failure, message: "Invoce sending failed" } });
                return;
            }
        }).catch((error) => {
            console.log(error);
        })


    }

}

module.exports = Invoice;