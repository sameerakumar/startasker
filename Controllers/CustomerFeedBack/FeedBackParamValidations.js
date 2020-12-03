const Joi = require('@hapi/joi');

var feedbackValidations = {
    ValidateFeedBackParams: (params) => {
        const registerSchema = Joi.object({
            customerID: Joi.string().required(),
            rating:  Joi.string().required(),
            taskerID: Joi.string().required(),
            comment: Joi.string().required()

        });
        return registerSchema.validate(params);
    },
    validateinsertParams: (params) =>{
        const registerSchema = Joi.object({
            customerID: Joi.string().required()
        });
        return registerSchema.validate(params);

    },
    validateDeleteParams: (params) =>{
        const registerSchema = Joi.object({
            customerID: Joi.string().required()
        });
        return registerSchema.validate(params);

    }
};
module.exports = feedbackValidations;