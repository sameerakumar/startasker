const AddRegion = require('./AddRegion');
const GetRegion = require('./FetchRegions');
const updateRegion = require('./UpdateProviderRegionStatus');
const DeleteRegion = require('./DeleteProviderRegion');
const DeleteAllRegions = require('./DeleteAllProviderRegion');

var Provider = {

    addRegion: (params,callback) => {
        return AddRegion.addRegions(params,callback);
    },
    fetchRegions: (params,callback) => {
        return GetRegion.fetchRegions(params,callback);
    },
    updateRegionStatus: (params,callback) => {
        return updateRegion.updateStatus(params,callback);
    },
    deleteRegion: (params,callback) => {
        return DeleteRegion.delete(params,callback);
    },
    deleteAllRegions: (params,callback) => {
        return DeleteAllRegions.deleteAllProviderRegions(params,callback);
    }
}

module.exports = Provider;