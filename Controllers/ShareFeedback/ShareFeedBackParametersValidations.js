const Joi = require('@hapi/joi');

var ShareFeedBackValidations = {
    validateinsertParams: (params) => {

        const shareFeedbackSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
                userName:Joi.string().optional().allow(''),
                profilePic: Joi.string().optional().allow(''),  
            ratingOptions:Joi.array().optional().allow(''),
            ratings: Joi.string().required(),
            body:Joi.string().optional().allow('')
        });
        return shareFeedbackSchema.validate(params);
    },
    validatefetchParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().email({minDomainSegments: 2}).required()
        });
        return registerSchema.validate(params);
    }
}


module.exports = ShareFeedBackValidations;