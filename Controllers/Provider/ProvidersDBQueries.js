const Regions = require('../../app/Models/Regions');


var providersDBQueries = {

    getAddNewProviderRegion: (params, regionid) => {
        const timestamp = new Date().getTime().toString();

        const regions = new Regions({
            regionId: regionid,
            userId: params.userId,
            region: params.region,
            timeStamp: timestamp
        })
        return regions;
    },

    getUpdateProviderRegionStatus: (params) => {
        return Regions.updateOne({ regionId: new RegExp(params.regionId, 'i') }, {
            $set: {
                regionStatus: params.status
            }
        }).exec()
    },
    getProviderRegions: (regionid) => {
        var query = { 
            $or: [{ 
                    regionId: { $regex: regionid, $options: 'i' }}] 
                    }
        return Regions.findOne(query).exec()
    },
    getProviderRegionsBasedOnID: (userId) => {
        var query = { 
            $or: [{ 
                userId: { $regex: userId, $options: 'i' }}] 
                    }
        return Regions.find(query,{ _id: 0, __v: 0}).exec()
    },
    getProviderRegionDeleteQuery: (regionId) => {
        return Regions.deleteOne({ regionId: new RegExp('^' + regionId + '$','i') }).exec()
      
    },
    getAllProviderRegionsDeleteQuery: (userId) => {
        return Regions.deleteMany({ userId: new RegExp('^' + userId + '$','i') }).exec()
      
    }

}

module.exports = providersDBQueries;