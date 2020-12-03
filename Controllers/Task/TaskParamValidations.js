const Joi = require('@hapi/joi');

var taskValidations = {
    validateinsertParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().required(),
            type: Joi.string().required(),
            message: Joi.string().required()
        });
        return registerSchema.validate(params);
    }
};
module.exports=taskValidations;