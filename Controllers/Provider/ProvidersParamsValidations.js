const Joi = require('@hapi/joi');

var providerValidations = {

    getAddProviderRegions: (params) =>{        
        const providerRegionsSchema = Joi.object({
            userId: Joi.string().required(),
            region: Joi.string().required()
        })
        return providerRegionsSchema.validate(params);
    },

    getUpdateProviderRegionStatus: (params) => {
        const updateSchema = Joi.object({
            regionId: Joi.string().required(),
            status: Joi.string().required()
        })
        return updateSchema.validate(params);
    },
    getProviderRegions: (params) => {
        const fetchSchema = Joi.object({
            userId: Joi.string().required()

        })
        return fetchSchema.validate(params);
    },
    getProviderRegionsByID: (params) => {
        const fetchSchema = Joi.object({
            regionId: Joi.string().required()

        })
        return fetchSchema.validate(params);
    }
}

module.exports = providerValidations;