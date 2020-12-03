const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AddContactParamValidations');
const dbQueries = require('./AddContactDBQueries');

var UpdateContact = {
    update:(params,callback)=>{
        const {error} = paramValidator.validateUpdateContactParams(params);
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
                let updateContactQuery = dbQueries.updateContactQuery(params);
                updateContactQuery.then((success)=>{
                    if(success){
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Contact updated successfully"
                            }
                        });
                        return;
                    }else{
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Contact update failed"
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

module.exports = UpdateContact;