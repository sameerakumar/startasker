const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CategoriesParamValidations');
const dbQueries = require('./CategoriesDBQueries');

var Updatesettingsdata = {
    updateamountdata:(params,callback)=>{
        const {error} = paramValidator.validateUpdatesettingsdataParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let fetchQuery = dbQueries.fetchQuery(params);
        fetchQuery.then((found)=>{
            if(found){
                let updateQuery = dbQueries.updateSettingsdataQuery(params);
                updateQuery.then((success)=>{
                    console.log("vinny",success)
                    if(success){
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Settings Amount data  updated successfully"
                            }
                        });
                        return;
                    }else{
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Settings Amount data update failed"
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
                        message: "No data found"
                    }
                });
                return;
            }
        })
    }

}

module.exports = Updatesettingsdata;