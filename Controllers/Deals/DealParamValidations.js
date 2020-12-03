const Joi = require('@hapi/joi');

var dealValidations = {
    validateinsertParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().required()
        });
        return registerSchema.validate(params);
    }
}
module.exports=dealValidations;