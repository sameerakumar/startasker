const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./ProvidersParamsValidations');
const pdbQueries = require('./ProvidersDBQueries');

var deleteAllRegions = {

    deleteAllProviderRegions: (params, callback) => {
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
        const getRegionQuery = pdbQueries.getProviderRegionsBasedOnID(params.userId);
        getRegionQuery.then((found) => {
            if(found){
                const deleteQuery = pdbQueries.getAllProviderRegionsDeleteQuery(params.userId);
                deleteQuery.then((deleted) =>{
                    if(deleted){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Regions has been delete successfully"
                            }
                        }); 
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Regions delete has been failed"
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

module.exports = deleteAllRegions;