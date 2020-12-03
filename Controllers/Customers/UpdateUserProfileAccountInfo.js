const statusCodes = require('../Core/StatusCodes');
var paramValidator= require('./CustomerParamsValidation');
var dbQueries = require('./CustomerDBQueries');
var UpdateProfileAccount = {
    updateProfileAccount:(params,callback) =>{
        const { error } = paramValidator.validateUpdateUserAccountProfileParams(params);
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
       
        let query = dbQueries.getUserQueryFromUserId(params.userID);
            query.then((user) => {
                if (user) {              
                    
                    return insertPostJobData(callback, params);
                    
                }
                else {
                    return callback({
                        status: 200,
                        data: { response: statusCodes.failure, message: "No user found with this userid" }
                    });
                }

            });
        
    }
}

function insertPostJobData(callback, params) {
    let updateProfileQuery = dbQueries.updateUserAccountProfileQuery(params);
    updateProfileQuery.then((err) => {
        if (!err) {
           // console.log(err);
            callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: "Profile failed to update"
                }
            });
            return;
        } 
            callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Profile updated successfully"
                }
            });
            return;
    })
}

module.exports = UpdateProfileAccount;
