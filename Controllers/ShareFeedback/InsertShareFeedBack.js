const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./ShareFeedBackParametersValidations');
const dbQueries = require('./ShareFeedBackDbQueries');

var ShareFeedBack = {
    shareFeedback: (params, callback) => {
        const {error} = paramValidator.validateinsertParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let fetchCustomerQuery = dbQueries.getCustomerQuery(params);
        fetchCustomerQuery.then((found)=>{
            if(found){
                var isGivenAppRatings = found.isGivenAppRatings;
                if(isGivenAppRatings === false){
                    let ReviewQuery = dbQueries.insertQuery(params);
                    ReviewQuery.save((success) => {
                        //console.log('found', Found);
                        if (success) {
                            let updateQuery = dbQueries.updateCustomerFeedBackStatusQuery(params);
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Thank you for you are valuble feedback"
                                }
                            });
                            return;
                        } else {
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "Faild to give feedback"
                                }
                            });
            
                        }
                    });
                }else{
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "User already given feedback"
                        }
                    });
                }
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found with this user"
                    }
                });
            }
        })

    }
};

module.exports = ShareFeedBack;