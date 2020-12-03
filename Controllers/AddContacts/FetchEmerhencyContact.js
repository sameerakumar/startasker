const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AddContactParamValidations');
const dbQueries = require('./AddContactDBQueries');

var FetchContact = {
    fetch:(params,callback)=>{
        const {error} = paramValidator.validateFetchContacts(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        let fetchQuery = dbQueries.getAllQuery(params);
        fetchQuery.then((found)=>{
            if(found){
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Contact fetched successfully",
                        contacts: found
                    }
                });
                return;
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Contact fetched failed"
                    }
                });
                return;
            }
        })
    }
}

module.exports = FetchContact;