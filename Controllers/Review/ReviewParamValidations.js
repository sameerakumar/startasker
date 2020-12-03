const Joi = require('@hapi/joi');

var reviewValidations = {
    validateCustomerRatingsParams: (params) => {
        const customerRatingsSchema = Joi.object({
            postID:Joi.string().required(),
            bookingID:Joi.string().required(),
            ratingsGivenBy :{
                userID: Joi.string().email({ minDomainSegments: 2 }).required(),
                name:Joi.string().optional().allow(''),
                profilePic: Joi.string().optional().allow('')
            },
            ratingsGivenTo:{
                userID: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
                name:Joi.string().optional().allow(''),
                profilePic: Joi.string().optional().allow('')
            },           
            ratingsAsAPoster:Joi.string().optional().allow(''),
            postTitle:Joi.string().optional().allow(''),
            body:Joi.string().required()
        });
        return customerRatingsSchema.validate(params);
    },
    validateProviderRatingsParams: (params) => {
        const providerRatingsSchema = Joi.object({
            postID:Joi.string().required(),
            bookingID:Joi.string().required(),
            ratingsGivenBy :{
                userID: Joi.string().email({ minDomainSegments: 2 }).required(),
                name:Joi.string().optional().allow(''),
                profilePic: Joi.string().optional().allow('')
            },
            ratingsGivenTo:{
                userID: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
                name:Joi.string().optional().allow(''),
                profilePic: Joi.string().optional().allow('')
            },           
            ratingsAsAProvider:Joi.string().optional().allow(''),
            body:Joi.string().required(),
            postTitle:Joi.string().optional().allow('')
        });
        return providerRatingsSchema.validate(params);
    },
    validateFetchReviewsParameter:(params)=>{
        const FetchReviewSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required()
        });
        return FetchReviewSchema.validate(params);
    }
}

module.exports = reviewValidations;