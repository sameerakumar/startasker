const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./ProvidersParamsValidations');
const pdbQueries = require('./ProvidersDBQueries');
const cdbQueries = require('../Customers/CustomerDBQueries');

var updateRegionStatus = {

    updateStatus: (params,callback) => {
        const { error } = paramValidations.getUpdateProviderRegionStatus(params);
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
        const getRegionsQuery = pdbQueries.getProviderRegions(params.regionId);
        getRegionsQuery.then((isFound) => {
            if(isFound){
                let updateRegionStatus = pdbQueries.getUpdateProviderRegionStatus(params);
                updateRegionStatus.then((updated_record) => {
                    if(updated_record.ok == 1){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Region status updated successfully"
                            }
                        }); 
                    }
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Region status update failed"
                        }
                    }); 
                });
             
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Regions found"
                    }
                }); 
            }
        })
    }
}

module.exports = updateRegionStatus;