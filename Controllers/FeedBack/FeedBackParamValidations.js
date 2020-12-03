const Joi = require('@hapi/joi');

var feedbackValidations = {
    ValidateFeedBackParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().required(),
            reviewMessage: Joi.string().required(),
            RatethisApp:  Joi.number().required(),

        });
        return registerSchema.validate(params);
    }
};
module.exports = feedbackValidations;