const Joi = require('@hapi/joi');

var newBookingParamsValidations = {
     partialNewBookingParamsValidations:(params)=>{
        const BookingSchema = Joi.object({
            paymentID: Joi.string().required(),
            bookingID: Joi.string().required(),
            postID: Joi.string().required(),
            serviceCategory: Joi.string().required(),
            taskTitle: Joi.string().required(),
            userID: Joi.string().required(),
            customerName: Joi.string().required(),
            customerProfilePic: Joi.string().optional().allow(''),
            location: Joi.string().required(),
            convenientTimings: Joi.array().required(),
            loc: Joi.array().required(),
            taskDate: Joi.array().required(),
            attachments: Joi.array().required(),
            mustHaves: Joi.array().required(),
            describeTaskInDetails: Joi.string().required(),
            bookedTaskers: Joi.array().items(Joi.object().keys({
            offeredUserID: Joi.string().required(),
            offeredUserName: Joi.string().required(),
            budget: Joi.number().required(),
            offeredUserProfilePic: Joi.string().required(),
            isCustomerCompletedTask: Joi.boolean().required(),
            isTaskerCompletedTask: Joi.boolean().optional().default(false),
            paymentStatusToProviderByAdmin: Joi.boolean().optional().default(false),
            isWithDraw:Joi.boolean().required(),
            ratingsToProvider: Joi.boolean().required(),
            ratingsToPoster: Joi.boolean().required()
            })),
            taskTotalBudget: Joi.number().required(),
            paymentStatus: Joi.string().required(),
            couponCode: Joi.string().optional().allow(''),
            couponDiscount: Joi.string().optional().allow(''),
            couponExpiryDate: Joi.string().optional().allow(''),
            couponAmount: Joi.string().optional().allow('')
        })
        return BookingSchema.validate(params);
    },
    validateBookingParameters: (params) =>{
        const BookingSchema = Joi.object({
            bookingID: Joi.string().required(),
            postID: Joi.string().required(),
            serviceCategory: Joi.string().required(),
            taskTitle: Joi.string().required(),
            userID: Joi.string().required(),
            customerName: Joi.string().required(),
            customerProfilePic: Joi.string().optional().allow(''),
            location: Joi.string().required(),
            convenientTimings: Joi.array().required(),
            loc: Joi.array().required(),
            taskDate: Joi.array().required(),
            attachments: Joi.array().required(),
            mustHaves: Joi.array().required(),
            describeTaskInDetails: Joi.string().required(),
            bookedTaskers: Joi.array().items(Joi.object().keys({
            offeredUserID: Joi.string().required(),
            offeredUserName: Joi.string().required(),
            budget: Joi.number().required(),
            offeredUserProfilePic: Joi.string().required(),
            isCustomerCompletedTask: Joi.boolean().required(),
            isTaskerCompletedTask: Joi.boolean().optional().default(false),
            paymentStatusToProviderByAdmin: Joi.boolean().optional().default(false),
            isWithDraw:Joi.boolean().required(),
            ratingsToProvider: Joi.boolean().required(),
            ratingsToPoster: Joi.boolean().required()
            })),
            taskTotalBudget: Joi.number().required(),                      
            paymentData: Joi.object().required(),
            paymentStatus: Joi.string().required(),
            couponCode: Joi.string().optional().allow(''),
            couponDiscount: Joi.string().optional().allow(''),
            couponExpiryDate: Joi.string().optional().allow(''),
            couponAmount: Joi.string().optional().allow('')           
        })
        return BookingSchema.validate(params);
    },
    validateHireProviderBookingParameters: (params) =>{
        const BookingSchema = Joi.object({
            bookingID: Joi.string().required(),          
            paymentData: Joi.object().required()           
        })
        return BookingSchema.validate(params);
    },
    validateFetchCustomerBookingsParameters: (params) =>{
        const customerGetBookingsSchema = Joi.object({
            userID: Joi.string().required()
        })
        return customerGetBookingsSchema.validate(params);
    },
    validateFetchCustomerBookingsWithBookingIDParameters: (params) =>{
        const customerGetBookingsWithBookingIDSchema = Joi.object({
            bookingID: Joi.string().required()
        })
        return customerGetBookingsWithBookingIDSchema.validate(params);
    },
    validateJobWithDrawByCustomer:(params) =>{
        const withDrawByCustomerSchema = Joi.object({
            bookingID: Joi.string().required(),
            offeredUserID: Joi.string().required(),
            isWithDraw: Joi.boolean().required(),
            withDrawnByPoster: Joi.boolean().required(),
            withDrawReason: Joi.string().optional()
        })
        return withDrawByCustomerSchema.validate(params);
    },
    validateJobCompletedStatusByCustomer:(params)=>{
        const JobStatusCompletedSchema = Joi.object({
            isCompletedByPoster: Joi.boolean().required(),
            bookingID: Joi.string().required(),
            bookedTaskers: Joi.array().required(),
            isTaskerCompletedTask: Joi.boolean().required()
        })
        return JobStatusCompletedSchema.validate(params);
    },
    validateFundsReleaseToProvidersParameters:(params)=>{
        const FundsRequestSchema = Joi.object({
            bookingID: Joi.string().required(),
            offeredUserID: Joi.string().required()
        })
        return FundsRequestSchema.validate(params);
    },
    validateCheckPaymentStatusBookingParams:(params)=>{
        const paymentStatusSchema = Joi.object({
            bookingID: Joi.string().required(),
            paymentID: Joi.string().required(),
            amount: Joi.number().required()
        })
        return paymentStatusSchema.validate(params);
    }

}

module.exports = newBookingParamsValidations;