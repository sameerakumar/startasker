const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AdminParamvalidations');
const dbQueries = require('./AdminDBQueries');

var referralUpdate = {
   referralpaid: (params, callback) => {
        const {error} = paramValidator.referralpaidparams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let referralpaidQuery = dbQueries.FetchreferralQuery(params.postID);
        referralpaidQuery.then((isFound) => {
            if (isFound) {
                let updateQuery = dbQueries.UpdatereferralQuery(params);
                updateQuery.then((isUpdate) => {
                    if (isUpdate) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Admin Referral Mark is Paid"
                            }
                        });
                        return;
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Admin Referral Mark is failed"
                            }
                        });
                    }
                })
            }
            else {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with us"
                    }
                });
                return;
            }

       });
    }
}


module.exports = referralUpdate;