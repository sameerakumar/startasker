const Joi = require('@hapi/joi');

var addcardValidations = {
    validateinsertParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().required(),
            cardNumber: Joi.string().required(),
            cardholderName: Joi.string().required(),
            expiryDate:  Joi.string().required()
        });
        return registerSchema.validate(params);
    },
    validateDeleteParams:(params) => {
        const schema = Joi.object({
            userID: Joi.string().required(),
            cardNumber: Joi.string().required()
        });
        return schema.validate(params);
    },
    validateDeleteAllParams:(params) => {
        const schema = Joi.object({
            userID: Joi.string().required()
        });
        return schema.validate(params);
    }
};
module.exports = addcardValidations;