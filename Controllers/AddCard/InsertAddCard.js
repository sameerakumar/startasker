const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AddCardParamValidations');
const dbQueries = require('./AddCardDBQueries');


var addCard = {
    card: (params, callback) => {
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
        let get_Query = dbQueries.getAddcardQuery(params);
        get_Query.then((isFound) => {
            if (isFound) {
                console.log("isfound", isFound.cards);
               isFound.cards.push(params);
                let addcardQuery = dbQueries.updateQuery(params,isFound.cards);
                addcardQuery.then((Found) => {
                    console.log('found', Found);
                    if (Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Addcard Insert successfully"
                            }
                        });
                        return;
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Addcard Insert failed"
                            }
                        });

                    }
                });
            }
            else {
                let AddCardQuery = dbQueries.insertQuery(params);
                AddCardQuery.save((Found) => {
                    console.log('found', Found);
                    if (!Found) {
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "AddCard Insert successfully"
                            }
                        });
                        return;
                    }
                });
            }
        })
    }
};

module.exports = addCard;