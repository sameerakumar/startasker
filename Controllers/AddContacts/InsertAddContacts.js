const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AddContactParamValidations');
const dbQueries = require('./AddContactDBQueries');

var addContact = {
    contact: (params, callback) => {
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
        let Query = dbQueries.fetchContactsByUserID(params);
        Query.then((isFound) => {
           if (isFound) {
               console.log("data",isFound)
               var count = 0;
               var contactlength;
               for (var i = 0; i < isFound.length; i++) {
                   contactlength = isFound[i].userID;
                   if (params.userID === contactlength) {
                       count = count + 1;
                   }
               }
               console.log("count", count);
               if (count < 3) {
                   let ContactQuery = dbQueries.insertQuery(params);
                   ContactQuery.save((Found) => {
                       if (!Found) {
                           callback({
                               status: 200,
                               data: {
                                   response: statusCodes.success,
                                   message: "Contact Insert successfully"
                               }
                           });
                           return;
                       } else {
                           return callback({
                               status: 200,
                               data: {
                                   response: statusCodes.failure,
                                   message: "Contact Insert failed"
                               }
                           });

                       }
                   });

               } else {

                   callback({
                       status: 200,
                       data: {
                           response: statusCodes.failure,
                           message: "You have option to add 3 contacts only"
                       }
                   });

               }

           }
             else {
               let ContactQuery = dbQueries.insertQuery(params);
               ContactQuery.save((Found) => {
                   if (!Found) {
                       callback({
                           status: 200,
                           data: {
                               response: statusCodes.success,
                               message: "Contact Insert successfully"
                           }
                       });
                       return;
                   } else {
                       return callback({
                           status: 200,
                           data: {
                               response: statusCodes.failure,
                               message: "Contact Insert failed"
                           }
                       });

                   }
               });
           }
    });

    }
}
module.exports = addContact;
