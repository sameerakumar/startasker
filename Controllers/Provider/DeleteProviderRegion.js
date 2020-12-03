const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./ProvidersParamsValidations');
const pdbQueries = require('./ProvidersDBQueries');

var deleteRegion = {

    delete: (params, callback) => {
        const { error } = paramValidations.getProviderRegionsByID(params);
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
        const getRegionQuery = pdbQueries.getProviderRegions(params.regionId);
        getRegionQuery.then((found) => {
            if(found){
                const deleteQuery = pdbQueries.getProviderRegionDeleteQuery(params.regionId);
                deleteQuery.then((deleted) =>{
                    if(deleted){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Region has been delete successfully"
                            }
                        }); 
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Region delete has been failed"
                            }
                        }); 
                    }
                })
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Region found to delete"
                    }
                }); 
            }
        })
    }
}

module.exports = deleteRegion;