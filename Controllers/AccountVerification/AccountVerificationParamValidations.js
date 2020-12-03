const Joi = require('@hapi/joi');

var accountverificationValidations = {
    validateinsertParams: (params) => {
        const registerSchema = Joi.object({
            userID : Joi.string().email({ minDomainSegments: 2 }).required(),
            Nationality: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            IDType: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            Email: Joi.string().required(),
            DOB: Joi.string().required(),
            Address: Joi.string().required(),
            PostCode: Joi.string().optional().allow(''),
            City: Joi.string().optional().allow(''),
            State: Joi.string().optional().allow(''),
            CountryRegion: Joi.string().optional().allow('')
        });
        return registerSchema.validate(params);
    },
    validateUpdateParams: (params) => {
        const Schema = Joi.object({
            IDNumber: Joi.string().required()
        });
        return Schema.validate(params);
    },
    validateFetchAccountParams:(params) =>{
        const FetchSchema = Joi.object({
            userID : Joi.string().email({ minDomainSegments: 2 }).required()
        });
        return FetchSchema.validate(params);
    }
}
module.exports = accountverificationValidations;