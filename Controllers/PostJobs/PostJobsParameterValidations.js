const Joi = require('@hapi/joi');

var newPostJobParamsValidations = {
    validateNewPostJobParamS:(params) => {
      const budgetType = Joi.object({
          Total: Joi.string().required(),
          HourlyRate: Joi.string().required()
      })
     let category = Joi.object({
        categoryId: Joi.string().required(),
        categoryName: Joi.string().required()
    })
        const schema = Joi.object({
            userID: Joi.string().required(),
            category: category.required(),           
            postTitle: Joi.string().required(),
            describeTaskInDetails: Joi.string().required(),
            numberOfWorkers:Joi.number().required(),
            canThisTaskRemote: Joi.string().required(),
            location: Joi.string().optional().allow(''),
            latitude: Joi.number().optional().allow(''),
            longitude: Joi.number().optional().allow(''),
            mustHaves: Joi.array().optional().allow(''),
            taskDate: Joi.array().required(),
            convenientTimings: Joi.array().optional().allow(''),
            budgetType: budgetType.required(),
            budget: Joi.number().required(),
            Hours: Joi.string().optional().allow(''),
            pricePerHour: Joi.number().optional().allow(''),
            post_Status: Joi.string().required()           
        })
        return schema.validate(params);
    },
    validateFetchJobParams:(params) => {
        const schema = Joi.object({
            userID : Joi.string().required()
        })
        return schema.validate(params);
    },

    validatePostJobsUpdateParams:(params) => {
        const budgetType = Joi.object({
            Total: Joi.string().required(),
            HourlyRate: Joi.string().required()
        })
        let category = Joi.object({
            categoryId: Joi.string().required(),
            categoryName: Joi.string().required()
        })
        const updateSchema = Joi.object({
            postID: Joi.string().required(),
            category: category.required(),
            postTitle: Joi.string().required(),
            describeTaskInDetails: Joi.string().required(),
            numberOfWorkers:Joi.number().required(),
            canThisTaskRemote: Joi.string().required(),
            location: Joi.string().optional().allow(''),
            latitude: Joi.number().optional().allow(''),
            longitude: Joi.number().optional().allow(''),
            mustHaves: Joi.array().optional().allow(''),
            taskDate: Joi.array().required(),
            convenientTimings: Joi.array().optional().allow(),
            budgetType: budgetType.required(),
            budget: Joi.number().required(),
            Hours: Joi.string().optional().allow(''),
            pricePerHour: Joi.number().optional().allow(''),
            post_Status: Joi.string().required()     
        })
        return updateSchema.validate(params);
    },

    validateBroseJobParams:(params) => {
        const schema = Joi.object({
            keyword : Joi.string().optional().allow(''),
            location : Joi.string().optional().allow(''),
            categories : Joi.array().optional().allow(''),
            latitude: Joi.string().optional(),
            longitude: Joi.string().optional(),
            radius: Joi.number().optional(),
            pageNo: Joi.number().required(),
            size: Joi.number().required()
        })
        return schema.validate(params);
    },

    validateDeleteJobParams:(params) =>{
        const schema = Joi.object({
            postID: Joi.string().required()
        })
        return schema.validate(params);
    },
    validateAddToFavouriteJobParams:(params) =>{
        const schema = Joi.object({
            postID: Joi.string().required(),
            favourite: Joi.boolean().required()
        })
        return schema.validate(params);
    },
    validateAddCommentsToPostJobsParams:(params) => {       
        const schema = Joi.object({
            postID: Joi.string().required(),          
            author: Joi.string().required(),
            author_comment: Joi.string().required(),
            author_email: Joi.string().required(),
            author_url: Joi.string().optional().allow(''),
            author_ip: Joi.string().optional().allow(''),
            timeStamp: Joi.string().required(),
            gmt_timeStamp: Joi.string().required()


        })
        return schema.validate(params);
    },
    validateUpdateJobAsFilledParams:(params) =>{
        const schema = Joi.object({
            postID: Joi.string().required(),
            filled: Joi.boolean().required()
        })
        return schema.validate(params);
    },
    validateAddOffersToPostJobsParams:(params) =>{
        const offersSchema = Joi.object({
            postID: Joi.string().required(),
            offeredUserID: Joi.string().required(),
            authorProfilePic:Joi.string().optional().allow(''),
            message: Joi.string().required(),
            authorName: Joi.string().optional().allow(''),
            budget: Joi.number().required()
        })
        return offersSchema.validate(params);
    },
    validateReplayToOfferMessages: (params) => {
        const ReplayToOffersSchema = Joi.object({
            offeredUserID: Joi.string().required(),
            postID: Joi.string().required(),
            userID:Joi.string().required(),
            message: Joi.string().required(),
            name: Joi.string().optional().allow(''),
            profilePic: Joi.optional().allow('')
        })
        return ReplayToOffersSchema.validate(params);
    },
    validateOfferUpdateParams:(params)=>{
        const offerUpdateSchema = Joi.object({
            postID: Joi.string().required(),
            offeredUserID: Joi.string().required(),
            budget: Joi.number().required(),
            message:Joi.string().required()
        })
        return offerUpdateSchema.validate(params);
    },
    validateOfferCancelParams:(params)=>{
        const offerCancelSchema = Joi.object({
            postID: Joi.string().required(),
            offeredUserID: Joi.string().required()
        });
        return offerCancelSchema.validate(params);
    },
    valiadtePaginationParamsForFetchingPostjobsParams:(params)=>{
        const paginationSchema = Joi.object({
            pageNo: Joi.number().required(),
            size: Joi.number().required(),
            location: Joi.string().optional().allow('')
        });
        return paginationSchema.validate(params);
    }
}


module.exports = newPostJobParamsValidations;