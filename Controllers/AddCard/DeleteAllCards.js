const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AddCardParamValidations');
const dbQueries = require('./AddCardDBQueries');
const fs = require('fs');

var Deleteallcards = {

    deletecard: (params, callback) => {
        const { error } = paramValidator.validateDeleteAllParams(params);
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
        let get_Query = dbQueries.getAddcardQuery(params);
        get_Query.then((found) => {
            console.log("found",found);
            if(found){

                const deleteQuery = dbQueries.deleteallQuery(params.userID);
                deleteQuery.then((deleted) => {
                    if (deleted) {
                        console.log('isdeleted',deleted)
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Addcard has been delete successfully"
                            }
                        });
                    } else {
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Addcard delete has been failed"
                            }
                        });
                    }
                })

            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Addcard found to delete"
                    }
                });
            }
        })
    }
};

module.exports = Deleteallcards;