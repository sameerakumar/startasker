const Joi = require('@hapi/joi');

var customerValidations = {
    validateParams:(params) => {       
        const customerInformationSchema = Joi.object({          
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(8).required(),
            register_type: Joi.string().required(),
            signupReferralBy : Joi.string().optional()
        });
        return customerInformationSchema.validate(params);
    },
    validateVerifyParams:(params)=>{
        let schema = Joi.object({
             userID: Joi.string().email({ minDomainSegments: 2 }).required(),
             otp: Joi.string().required()
         });
         return schema.validate(params)
     },    
     validateLoginParams:(params)=>{
        let schema = Joi.object({
             userID: Joi.string().email({ minDomainSegments: 2 }).required(),
             password: Joi.string().min(8).required(),
             deviceID: Joi.string().optional().allow(''),
             deviceToken: Joi.string().optional().allow(''),
             deviceType: Joi.string().optional().allow('')
         });
         return schema.validate(params)
     },
     validateForgotPasswordParams:(params)=>{
        let schema = Joi.object({
             userID: Joi.string().email({ minDomainSegments: 2 }).required(),
             isReSendOtp: Joi.boolean().optional()       
         });
         return schema.validate(params)
     },
     validateSearchingUserWithUserNameParams:(params)=>{
        let schema = Joi.object({
             userName: Joi.string().required()       
         });
         return schema.validate(params)
     },
     validateUpdateParams:(params) => {
       
        const customerInformationSchema = Joi.object({
            userID: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
            postTask: Joi.string().required(),
            completeTask: Joi.string().required(),
            address: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            dob: Joi.string().optional().allow(''),
            deviceID: Joi.string().optional(),
            deviceToken: Joi.string().required(),
            deviceType: Joi.string().required()
        });
        return customerInformationSchema.validate(params);
    },
    validateSocial_MediaLoginParams:(params) => {       
        const customerInformationSchema = Joi.object({
            ID: Joi.string().required(),
            tokenID: Joi.string().optional().allow(''),
            userID: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            profilePic: Joi.string().optional().allow(''),
            register_type: Joi.string().required(),
            deviceID: Joi.string().optional().allow(''),
            deviceToken: Joi.string().optional().allow(''),
            deviceType: Joi.optional().allow(''),
            signupReferralBy : Joi.string().optional()           
        });
        return customerInformationSchema.validate(params);
    },

    validateCustomerSkillsUpdateParameters:(params) =>{
        let trasportations = {
            Bicycle: params.trasportations.Bicycle,
            Car: params.trasportations.Car,
            Online: params.trasportations.Online,
            Scooter: params.trasportations.Scooter,
            Truck: params.trasportations.Truck,
            Walk: params.trasportations.Walk
        }
        const customerSkillsInfoSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            trasportations: trasportations,
            languages: Joi.array().optional().allow(''),
            education: Joi.array().optional().allow(''),
            work: Joi.array().optional().allow(''),
            specialities: Joi.array().optional().allow('')

        })
        return customerSkillsInfoSchema.validate(params);
    },
    validateCustomerTaskAlertsUpdateParameters:(params) =>{      
        const TaskAlertSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            taskAlert: Joi.string().required()
        });
        return TaskAlertSchema.validate(params);
    },
    validateAddCustomerCustomTaskAlertsParameters:(params) =>{
        let alertType = Joi.object({
            inPerson: Joi.string().required(),
            remote: Joi.string().required()
        })
        const AddCustomTaskAlertSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            alertType: alertType.required(),
            taskKeyword: Joi.array().required(),
            taskName: Joi.array().required(),
            taskLoc: Joi.array().optional().allow(),
            taskLocation: Joi.string().optional().allow(''),
            taskDistance: Joi.number().optional().allow('')
        })
        return AddCustomTaskAlertSchema.validate(params);
    },
    validateUpdateCustomerCustomTaskAlertsParameters:(params) =>{
        let alertType = Joi.object({
            inPerson: Joi.string().required(),
            remote: Joi.string().required()
        })
        const updateCustomTaskAlertSchema = Joi.object({
            alertID: Joi.string().required(),
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            alertType: alertType.required(),            
            taskKeyword: Joi.array().required(),
            taskName: Joi.array().required(),
            taskLoc : Joi.array().optional().allow(''),
            taskLocation: Joi.string().optional().allow(''),
            taskDistance: Joi.number().optional().allow('')
        })
        return updateCustomTaskAlertSchema.validate(params);
    },
    validateDeleteCustomerCustomTaskAlertsParameters:(params) =>{
        const DeleteCustomAlertParameters = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            alertID: Joi.string().required()
        })
        return DeleteCustomAlertParameters.validate(params);
    },
    validateUpdateCustomerNotificationsParameters:(params) =>{
        let transactional = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required()
        })
        let taskUpdates = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required(),
        })                
        let taskReminders = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required(),
        })                
        let startaskerAlerts = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required(),
        })                
        let taskRecommendations = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required(),
        })                
        let helpfullInfo = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required(),
        })                
        let updateNewsletters = Joi.object({
            Email: Joi.string().required(),
            Push: Joi.string().required(),
        })                
        const DeleteCustomAlertParameters = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            transactional: transactional.required(),
            taskUpdates: taskUpdates.required(),
            taskReminders: taskReminders.required(),
            startaskerAlerts: startaskerAlerts.required(),
            taskRecommendations: taskRecommendations.required(),
            helpfullInfo: helpfullInfo.required(),
            updateNewsletters: updateNewsletters.required()
           })
        return DeleteCustomAlertParameters.validate(params);
    },
    validateChangePasswordParams: (params) => {
        const Changeschema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            oldPassword: Joi.string().min(8).required(),
            newPassword: Joi.string().min(8).required()
        });
        return Changeschema.validate(params);
    },
    validateSearchConfigurationParams:(params) => {
        const SearchSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            taskTypes: Joi.string().required(),
            lat: Joi.string().required(),
            long: Joi.string().required(),
            locationName: Joi.string().required(),
            radius: Joi.number().required(),
            maxPrice: Joi.number().required(),
            minPrice: Joi.number().required(),
            locationName: Joi.string().required(),
            hideAssignedTask: Joi.string().required(),
            search_term: Joi.string().optional().allow(''),
            pageNo: Joi.number().required(),
            size: Joi.number().required()
        })
        return SearchSchema.validate(params);
    },
    UpdateProfileParams:(params) => {
        const updateSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required()
        });
            return updateSchema.validate(params);
    },
    UpdateAccountParams:(params) =>{
        const updateSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            Accountholdername: Joi.string().required(),
            Accountnumber: Joi.string().required(),
            BSB: Joi.string().required()
        })
        return updateSchema.validate(params);
    },
    UpdateAddressParams:(params) =>{
        const updateSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            AddressLine1: Joi.string().required(),
            AddressLine2: Joi.string().optional().allow(''),
            Suburb: Joi.string().optional().allow(''),
            State: Joi.string().required(),
            Postcode: Joi.string().required(),
            Country: Joi.string().required()
        })
        return updateSchema.validate(params);
    },
    UpdateDOBParams:(params) =>{
        const updateSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            dob: Joi.string().required()
        })
        return updateSchema.validate(params);
    },

    UpdateMobilenoParams:(params) =>{
        const updateSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            phoneNumber: Joi.string().required()
        })
        return updateSchema.validate(params);
    },
    validateUpdateUserAccountProfileParams:(params) => {
       
        const customerInformationSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            firstName: Joi.string().optional().allow(''),
            lastName: Joi.string().optional().allow(),
            latitude: Joi.string().optional().allow(''),
            longitude: Joi.string().optional().allow(''),
            businessNumber: Joi.string().optional().allow(''),
            birthDay: Joi.string().optional().allow(''),
            aboutMe: Joi.string().optional().allow(''),
            address : Joi.string().optional().allow(''),
            postTask : Joi.boolean().required(),
            completeTask : Joi.boolean().required(),
            gallery : Joi.array().required()
            
        });
        return customerInformationSchema.validate(params);
    },
    validateUserLogoutParameters:(params)=>{
        const logoutSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            deviceID: Joi.string().optional(),
            deviceToken: Joi.string().required(),
            deviceType: Joi.string().required()
        })

        return logoutSchema.validate(params);
    },
    validateUpdateUserActiveTimeStamp:(params)=>{
        const TimeStampSchema = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            activeTimeStamp: Joi.string().required() 
        });
        return TimeStampSchema.validate(params);
    },
    validateDeleteFileParams:(params) =>{
        const DeleteParams = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            path: Joi.string().required()
        });
        return DeleteParams.validate(params);
    },
    validateCouponAvailablity:(params) =>{
        const checkAvailablity = Joi.object({
            userID: Joi.string().email({ minDomainSegments: 2 }).required(),
            couponCode: Joi.string().required()
        })
        return checkAvailablity.validate(params);
    },
    validateReferralCode:(params) =>{
        const refferalSchema = Joi.object({
            referralCode : Joi.string().required()
        })
        return refferalSchema.validate(params);
    }
}

module.exports = customerValidations;