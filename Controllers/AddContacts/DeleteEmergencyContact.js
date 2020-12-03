const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AddContactParamValidations');
const dbQueries = require('./AddContactDBQueries');

var DeleteContact = {

    delete:(params,callback)=>{
        const {error} = paramValidator.validateDeleteContactParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchContactQuery = dbQueries.fetchContactByItsId(params);
        fetchContactQuery.then((found)=>{
            if(found){
                let deleteContactQuery = dbQueries.deleteContactQuery(params);
                deleteContactQuery.then((deleted)=>{
                    if(deleted){
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Contact deleted successfully"
                            }
                        });
                        return;
                    }else{
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Contact failed to delete"
                            }
                        });
                        return;
                    }
                })
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No contact found"
                    }
                });
                return;
            }
        })
    }
}

module.exports = DeleteContact;