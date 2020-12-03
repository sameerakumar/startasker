const Joi = require('@hapi/joi');

var CustomerInboxValidations = {
    validateFeFetchingInboxParams:(params) => {       
        const customerInboxSchema = Joi.object({          
            userID: Joi.string().email({ minDomainSegments: 2 }).required()
            
        });
        return customerInboxSchema.validate(params);
    },
    validateDeleteNotificationByItsIDParams:(params) =>{
        const deleteByItsIDSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            notifyID: Joi.string().required()
        });
        return deleteByItsIDSchema.validate(params);
    },
    validateAllDeleteNotificationParams:(params) =>{
        const deleteAllSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required()
        });
        return deleteAllSchema.validate(params);
    }

}

module.exports = CustomerInboxValidations;