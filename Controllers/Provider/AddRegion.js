const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./ProvidersParamsValidations');
const pdbQueries = require('./ProvidersDBQueries');
const cdbQueries = require('../Customers/CustomerDBQueries');
const generateId = require('../Core/IDGenerate');

var addProviderRegions = {

    addRegions: (params,callback) => {
        const { error } = paramValidations.getAddProviderRegions(params);
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
        const userId = params.userId;
        const getUserQuery = cdbQueries.getUserQueryFromUserId(userId);
        getUserQuery.then((isFound) => {
            if(isFound){
                const regionid = 'Region' + generateId.makeId();
                const addQuery = pdbQueries.getAddNewProviderRegion(params, regionid);
                addQuery.save((err) =>{
                   if(err){
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Region added failed"
                        }
                    });
                   }
                   callback({ 
                       status: 200, 
                       data: { 
                           response: statusCodes.success, 
                           message: "Region added successfully", 
                           regionId: regionid
                        } 
                    });
                   return;
                })
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Provider not found with us to add region"
                    }
                });
            }
        })
    }
}

module.exports = addProviderRegions;