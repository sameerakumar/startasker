const Joi = require('@hapi/joi');

var adminValidations = {
    validateParams: (params) => {
        const registerSchema = Joi.object({
            userID: Joi.string().required(),
            password: Joi.string().required()
        });
        return registerSchema.validate(params);
    },
    validateLoginParams: (params) => {
        const loginSchema = Joi.object({
            userID: Joi.string().required(),
            password: Joi.string().min(8).required()
        });
        return loginSchema.validate(params);
    },
    validateDeleteParams:(params) => {
        const schema = Joi.object({
            author_email: Joi.string().required(),
            postID: Joi.string().required()
        });
        return schema.validate(params);
    },
    validateUpdateParams:(params) => {
        const schema = Joi.object({
            author_email: Joi.string().required(),
            postID: Joi.string().required(),
            author_comment: Joi.string().required(),
            comment_date: Joi.string().required()

        });
        return schema.validate(params);
    },
    validateTaskDeleteParams:(params) => {
        const schema = Joi.object({
            offeredUserID: Joi.string().required(),
            postID: Joi.string().required()
        });
        return schema.validate(params);
    },
    paymentAdminparams:(params) =>{
        const schema = Joi.object({
            offeredUserID: Joi.string().required(),
             bookingID: Joi.string().required(),
            type: Joi.string().optional()
        });
        return schema.validate(params);
    },
    customerParams:(params) => {
        const schema = Joi.object({
            userID: Joi.string().required(),
            pageNo:Joi.string().optional().allow(''),
            size:Joi.string().optional().allow('')
           //bookingID: Joi.string().required()
        });
        return schema.validate(params);
    },
    TaskerParams:(params) => {
        const schema = Joi.object({
            postID: Joi.string().required(),
        });
        return schema.validate(params);
    },
    UpdateParams:(params) => {
        const schema = Joi.object({
            userID: Joi.string().required(),
            isVerified: Joi.string().required(),
            reason:Joi.string().optional().allow('')
        });
        return schema.validate(params);
    },
    validateFilterParams:(params) =>{
        const schema = Joi.object({
            sortBy: Joi.string().required(),
            fromdate: Joi.string().optional(),
            todate: Joi.string().optional()
        })
    },
    filterBookingsParams:(params) => {
        const schema = Joi.object({
        
        type: Joi.string().required(),
        pageNo:Joi.string().required(),
        size:Joi.string().required(),
        fromdate: Joi.string().optional().allow(''),
        todate: Joi.string().optional().allow('')
        });
        return schema.validate(params);
        },
    validatedParams:(params) => {
        const schema = Joi.object({
            type: Joi.string().optional().allow('')
        });
        return schema.validate(params);
    },
    validateTaskParams:(params) => {
        const schema = Joi.object({
            taskStatus: Joi.string().required(),
            pageNo: Joi.string().required(),
            size: Joi.string().required(),
            fromdate: Joi.string().optional().allow(''),
            todate: Joi.string().optional().allow('')
        });
        return schema.validate(params);
    },
    validatereferralParams:(params) => {
        const schema = Joi.object({
            type: Joi.string().required(),
            pageNo:Joi.string().required(),
            size:Joi.string().required(),
            fromdate: Joi.string().optional().allow(''),
            todate: Joi.string().optional().allow('')
        });
        return schema.validate(params);
    },
    validatefilteParams:(params) => {
        const schema = Joi.object({
            type: Joi.string().required(),
            sortBy: Joi.string().required(),
            pageNo:Joi.string().required(),
            size:Joi.string().required(),
            fromdate: Joi.string().optional().allow(''),
            todate: Joi.string().optional().allow('')
           // sortedByDates: Joi.array().optional().allow('')
        });
        return schema.validate(params);
    },
    filterParams:(params) => {
        const schema = Joi.object({

            sortBy: Joi.string().required(),
            fromdate: Joi.string().optional().allow(''),
            todate: Joi.string().optional().allow('')
            // sortedByDates: Joi.array().optional().allow('')
        });
        return schema.validate(params);
    },

    validatepagination:(params)=>{
        const schema= Joi.object({
            pageNo:Joi.string().required(),
            size:Joi.string().required(),
        })
        return schema.validate(params);
    },
    validateCustomerDetailsParams :(params) =>{
        const schema =Joi.object({
            fromDate : Joi.string().required(),
            toDate : Joi.string().required()
        });
        return schema.validate(params);
    },
    validateSendNotificationParams :(params) =>{
        const schema =Joi.object({
            userID :Joi.string().required(),
            userIDS: Joi.array().required(),
            title : Joi.string().required(),
            Content: Joi.string().required() 
        });
        return schema.validate(params);
    },
    referralpaidparams:(params)=>{
        const schema= Joi.object({
            postID:Joi.string().required(),
        })
        return schema.validate(params);
    },
    validateReportsDetailsParams :(params) =>{
        const schema =Joi.object({
            fromDate : Joi.string().required(),
            toDate : Joi.string().required(),
            reportType:Joi.string().required(),
            reportStatus : Joi.string().optional() 
        });
        return schema.validate(params);
    },
    validateBookingReportDetailsParams :(params) =>{
        const schema =Joi.object({
            fromDate : Joi.string().optional(),
            toDate : Joi.string().optional(),
            sortBy:Joi.string().optional(), 
        });
        return schema.validate(params);
    },
    validateGetAdminByUserID:(params)=>{
        const schema = Joi.object({
            userID: Joi.string().required()
        });
        return schema.validate(params);
    },
    validateFetchCustomerUserIDsParams:(params)=>{
        const schema = Joi.object({
            type: Joi.string().required()
        })
        return schema.validate(params);
    },
    validateDeleteAdminNotificationParams:(params)=>{
        const schema = Joi.object({
            type: Joi.string().required(),
            userID : Joi.string().required(),
            notifyID: Joi.string().required()
        });
        return schema.validate(params);
    },
    validateTotalBookingsParams :(params) =>{
        const schema = Joi.object({
            getTypeFilter : Joi.string().required()
        });
        return schema.validate(params);
    }
}
module.exports = adminValidations;