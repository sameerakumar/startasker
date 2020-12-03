const Joi = require('@hapi/joi');

var couponValidations = {
    validateinsertParams: (params) => {
        const couponSchema = Joi.object({
            couponID: Joi.string().required(),
            couponCode : Joi.string().required(),
            expiryData : Joi.string().required(),
            couponAmount: Joi.string().required()
        });
        return couponSchema.validate(params);
    },
    validateupdateParams:(params) =>{
        const updateSchema = Joi.object({
            couponID: Joi.string().required(),
            couponCode: Joi.string().required()
        })
        return updateSchema.validate(params);
    },
    validateDeleteParams:(params) => {
        const schema = Joi.object({
            couponID: Joi.string().required()
        });
        return schema.validate(params);
    },
};
module.exports = couponValidations;