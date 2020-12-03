const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./ProvidersParamsValidations');
const pdbQueries = require('./ProvidersDBQueries');
const cdbQueries = require('../Customers/CustomerDBQueries');
const generateId = require('../Core/IDGenerate');

var fetchProviderRegions = {

    fetchRegions:(params, callback) => {
        const { error } = paramValidations.getProviderRegions(params);
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
        let getQuery = pdbQueries.getProviderRegionsBasedOnID(params.userId);
        getQuery.then((isFound) => {
            if(isFound){
                callback({ 
                    status: 200, 
                    data: { 
                        response: statusCodes.success, 
                        message: "Provider Regions fetched successfully", 
                        regionsList: isFound
                     } 
                 });
                return;
            }else{
                callback({ 
                    status: 200, 
                    data: { 
                        response: statusCodes.failure, 
                        message: "No Regions found for this provider", 
                        regionsList: []
                     } 
                 });
            }
        })
    }
}

module.exports = fetchProviderRegions;