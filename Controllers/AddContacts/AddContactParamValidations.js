const Joi = require('@hapi/joi');

var contactValidations = {
    validateinsertParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().required(),
            NameoftheContactPerson: Joi.string().required(),
           contact:{ phoneNumber: Joi.string().required(),
            countryCode: Joi.string().required()}
        });
        return registerSchema.validate(params);
    },
    validateFetchContacts:(params)=>{
        const FetchContactSchema = Joi.object({
            userID: Joi.string().required()
        });
        return FetchContactSchema.validate(params);     
    },
    validateUpdateContactParams: (params) => {
        const updateContactSchema = Joi.object({
            _id: Joi.string().required(),
            NameoftheContactPerson: Joi.string().required(),
           contact:{ phoneNumber: Joi.string().required(),
            countryCode: Joi.string().required()}
        });
        return updateContactSchema.validate(params);
    },
    validateDeleteContactParams: (params) => {
        const updateContactSchema = Joi.object({
            _id: Joi.string().required()            
        });
        return updateContactSchema.validate(params);
    }
}

module.exports = contactValidations;