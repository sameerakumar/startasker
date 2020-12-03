const Customers = require('../../app/Models/Customers');
const CustomersSettings = require('../../app/Models/CustomerSettings');
const PostJob = require('../../app/Models/PostJob');
const notify = require('../../app/Models/Notifications');
const Inbox = require('../../app/Models/NotificationsInbox');
const bcrypt = require('bcryptjs');
//const Coupons = require('./../../app/Models/Coupons');
const Account = require('./../../app/Models/AccountVerification');
const referralID = require('../../Controllers/Core/IDGenerate');
const { param } = require('../../routes/Customer');
const Earnings = require('../../app/Models/ReferAndEarn');

var CustomersDBQueries = {
    getCustomerQuery: (params) => {
        var query = {
            $or: [{
                userID: { $regex: params.userID, $options: 'i' }
            }]
        }
        return Customers.findOne(query, { _id: 0, __v: 0 }).exec()

    },
    getAppleCustomerQuery: (params) => {
        var query = {
            $or: [{
                "Apple.AppleID": { $regex: params.ID, $options: 'i' }
            }]
        }
        return Customers.findOne(query, { _id: 0, __v: 0 }).exec()

    },
    getAggreateQuery: (userID) => {
        return Customers.aggregate([
            {
                $match: {
                    userID: new RegExp('^' + userID + '$', "i")
                }
            },
            {
                $lookup: {
                    from: "settings",
                    localField: "userID",
                    foreignField: "userID",
                    as: "Settings"
                }
            },
            {
                $lookup: {
                    from: "accountverifications",
                    localField: "userID",
                    foreignField: "userID",
                    as: "accountData"
                }
            },
            { $unwind: '$accountData' }
        ]).exec()
    },
    getUserQueryFromUserId: (userID) => {
        var query = {
            $or: [{
                userID: { $regex: userID, $options: 'i' }
            }, {
                'Facebook.facebookID': { $regex: userID, $options: 'i' }
            }
            ]
        }
        return Customers.findOne(query, { _id: 0, __v: 0 }).exec()
    },
    getUserFromUserFirstName: (userName) =>{
        return Customers.findOne({ firstName : new RegExp('^' + userName + '$', "i")}).exec()
    },

    prepareUserUpdate: (userID, isVerified) => {
        return Customers.updateOne({ userID: new RegExp(userID, 'i') }, {
            $set: {
                verification_status: isVerified,
            }
        }).exec()
    },
    prepareForgotPasswordOTPUpdate: (userID, otp) => {
        const otp_req_time = new Date().getTime().toString();
        return Customers.updateOne({ userID: new RegExp('^' + userID + '$', "i") },
            {
                $set: {
                    otp: otp,
                    otp_time: otp_req_time
                }
            }).exec()
    },
   newCustomerInsertQuery:(params,otp,referralCode,signupReferralBy) => {
       let hashedPassword = bcrypt.hashSync(params.password, 8);        
       const register_timestamp = new Date().getTime().toString();
       if(signupReferralBy){
           let customer =  new Customers({ 
               userID: params.userID,
               password: hashedPassword,
               otp: otp,
               otp_time: register_timestamp,
               register_type: params.register_type,
               register_time: register_timestamp,
               referralCode :   referralCode,
               signupReferralInfo : {
                referralCode:params.signupReferralBy,
                userID:params.refferalUserID,
                }
           })
           return customer;
       }
       else{
           let customer =  new Customers({ 
               userID: params.userID,
               password: hashedPassword,
               otp: otp,
               otp_time: register_timestamp,
               register_type: params.register_type,
               register_time: register_timestamp,
               referralCode :   referralCode
           })
           return customer;
       }
    }, 
    unVerifiedCustomerQuery: (params, otp) => {
        let hashedPassword = bcrypt.hashSync(params.password, 8);
        const register_timestamp = new Date().getTime().toString()
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    userID: params.userID,
                    password: hashedPassword,
                    otp: otp,
                    otp_time: register_timestamp,
                    register_type: params.register_type,
                    register_time: register_timestamp,

                }
            }).exec()
    },
    customerInfoUpdateQuery: (params, imageName) => {
        const search_Configurations = {
            lat: params.latitude,
            long: params.longitude,
            locationName: params.address,
            radius: '5000',
            maxPrice: '9999',
            minPrice: '5',
            taskTypes: 'All',
            hideAssignedTask: false
        }
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    loc: [params.latitude, params.longitude],
                    postTask: params.postTask,
                    completeTask: params.completeTask,
                    address: params.address,
                    phoneNumber: params.phoneNumber,
                    dob: params.dob,
                    profilePic: imageName,
                    isProfileUpdate: true,
                    search_Configurations: search_Configurations

                }
            }).exec()
    },
    getCustomersDeleteQuery: (userID) => {

        return Customers.deleteOne({ userID: new RegExp(userID, 'i') }).exec()
    },

    getUpdateForResetPassword: (userID, newPassword) => {
        return Customers.updateOne({ userID: new RegExp(userID, 'i') }, {
            $set: {
                password: newPassword,
            }
        }).exec()
    },
    getFacebookNewCustomerInsertQuery: (params,signupReferralBy) => {
        let password = 'startasker';
        let hashedPassword = bcrypt.hashSync(password, 8);
        let Facebook = {
            facebookID: params.ID,
            tokenId: params.tokenID
        }
        var userID;
        if (params.userID !== '') {
            userID = params.userID
        } else {
            userID = params.ID
        }
        if(signupReferralBy){
            const register_timestamp = new Date().getTime().toString()
        let customer = new Customers({
            userID: userID,
            password: hashedPassword,
            otp: 'startasker',
            register_type: params.register_type,
            register_time: register_timestamp,
            Facebook: Facebook,
            firstName: params.firstName,
            lastName: params.lastName,
            loc: [params.latitude, params.longitude],
            verification_status: true,
            profilePic: params.profilePic,
            referralCode :   'ST' + referralID.makeId(),           
            signupReferralInfo : {
                referralCode:params.signupReferralBy,
                userID:params.refferalUserID,
                }
        })
        return customer;
        }else{
            const register_timestamp = new Date().getTime().toString()
            let customer = new Customers({
                userID: userID,
                password: hashedPassword,
                otp: 'startasker',
                register_type: params.register_type,
                register_time: register_timestamp,
                Facebook: Facebook,
                firstName: params.firstName,
                lastName: params.lastName,
                loc: [params.latitude, params.longitude],
                verification_status: true,
                profilePic: params.profilePic,
                referralCode :   'ST' + referralID.makeId(),
            })
    
            return customer;
        }
    },
    getFaceBookIDQuery: (params) => {
        return Customers.findOne({ 'Facebook.facebookID': new RegExp('^' + params.ID + '$', "i") }, { _id: 0, __v: 0 }).exec()
    },
    getGoogleNewCustomerInsertQuery: (params, signupReferralBy) => {
        let password = 'startasker';
        let hashedPassword = bcrypt.hashSync(password, 8);
        let Google = {
            GoogleID: params.ID,
            tokenId: params.tokenID
        }
        if(signupReferralBy){
        const register_timestamp = new Date().getTime().toString()
        let customer = new Customers({
            userID: params.userID,
            password: hashedPassword,
            otp: 'startasker',
            register_type: params.register_type,
            register_time: register_timestamp,
            Google: Google,
            firstName: params.firstName,
            lastName: params.lastName,
            loc: [params.latitude, params.longitude],
            verification_status: true,
            profilePic: params.profilePic,
            referralCode :   'ST' + referralID.makeId(),
            signupReferralInfo : {
                referralCode:params.signupReferralBy,
                userID:params.refferalUserID,
                }
        })
        return customer;
        }else{
            const register_timestamp = new Date().getTime().toString()
        let customer = new Customers({
            userID: params.userID,
            password: hashedPassword,
            otp: 'startasker',
            register_type: params.register_type,
            register_time: register_timestamp,
            Google: Google,
            firstName: params.firstName,
            lastName: params.lastName,
            loc: [params.latitude, params.longitude],
            verification_status: true,
            profilePic: params.profilePic,
            referralCode :   'ST' + referralID.makeId()           
        })
        return customer;
        }       

    },
    getAppleNewCustomerInsertQuery: (params,signupReferralBy) => {
        let password = 'startasker';
        let hashedPassword = bcrypt.hashSync(password, 8);
        let Apple = {
            AppleID: params.ID,
            tokenId: params.tokenID
        }
        if(signupReferralBy){
            const register_timestamp = new Date().getTime().toString()
        let customer = new Customers({
            userID: params.userID,
            password: hashedPassword,
            otp: 'startasker',
            register_type: params.register_type,
            register_time: register_timestamp,
            Apple: Apple,
            firstName: params.firstName,
            lastName: params.lastName,
            loc: [params.latitude, params.longitude],
            verification_status: true,
            profilePic: params.profilePic,
            referralCode :   'ST' + referralID.makeId(),
            signupReferralInfo : {
                referralCode:params.signupReferralBy,
                userID:params.refferalUserID,
                }
        })
        return customer;
        }else{
            const register_timestamp = new Date().getTime().toString()
        let customer = new Customers({
            userID: params.userID,
            password: hashedPassword,
            otp: 'startasker',
            register_type: params.register_type,
            register_time: register_timestamp,
            Apple: Apple,
            firstName: params.firstName,
            lastName: params.lastName,
            loc: [params.latitude, params.longitude],
            verification_status: true,
            profilePic: params.profilePic,
            referralCode :   'ST' + referralID.makeId()            
        })
        return customer;
        }
        
    },
    getFBCustomerUpdateQuery: (params) => {
        let Facebook = {
            facebookID: params.ID,
            tokenId: params.tokenID
        }
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    loc: [params.latitude, params.longitude],
                    Facebook: Facebook

                }
            }).exec()
    },
    getGoogleCustomerUpdateQuery: (params) => {
        let Google = {
            GoogleID: params.ID,
            tokenId: params.tokenID
        }
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    loc: [params.latitude, params.longitude],
                    Google: Google

                }
            }).exec()
    },

    getAppleCustomerUpdateQuery: (params) => {
        let Apple = {
            AppleID: params.ID,
            tokenId: params.tokenID
        }
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    loc: [params.latitude, params.longitude],
                    Apple: Apple

                }
            }).exec()
    },

    getInsertCustomerSkillsQuery: (params) => {
        let skills = {
            trasportations: params.trasportations,
            languages: params.languages,
            education: params.education,
            work: params.work,
            specialities: params.specialities
        }
        let CustomerSettings = new CustomersSettings({
            userID: params.userID,
            skills: skills
        })
        return CustomerSettings;
    },
    getUpdateCustomerSkillsQuery: (params) => {
        let skills = {
            trasportations: params.trasportations,
            languages: params.languages,
            education: params.education,
            work: params.work,
            specialities: params.specialities
        }
        return CustomersSettings.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    skills: skills
                }
            }).exec()
    },
    getUpdateCustomerNotificationsQuery: (params) => {
        let notifications = {
            transactional: {
                Email: params.transactional.Email,
                Push: params.transactional.Push
            },
            taskUpdates: {
                Email: params.taskUpdates.Email,
                Push: params.taskUpdates.Push
            },
            taskReminders: {
                Email: params.taskReminders.Email,
                Push: params.taskReminders.Push
            },
            startaskerAlerts: {
                Email: params.startaskerAlerts.Email,
                Push: params.startaskerAlerts.Push
            },
            taskRecommendations: {
                Email: params.taskRecommendations.Email,
                Push: params.taskRecommendations.Push
            },
            helpfullInfo: {
                Email: params.helpfullInfo.Email,
                Push: params.helpfullInfo.Push
            },
            updateNewsletters: {
                Email: params.updateNewsletters.Email,
                Push: params.updateNewsletters.Push
            }
        }
        return CustomersSettings.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    notifications: notifications
                }
            }).exec()
    },
    getCustomerSettingQuery: (params) => {
        return CustomersSettings.findOne({ userID: new RegExp('^' + params.userID + '$', "i") }, { _id: 0, __v: 0 }).exec()
    },
    insertCustomerQuery: (userID) => {
        let CustomerSettings = new CustomersSettings({
            userID: userID
        })
        return CustomerSettings;
    },
    insertUserInboxQuery: (userID) => {
        let userInbox = new Inbox({
            userID: userID
        })
        return userInbox;
    },
    insertUserAccountVerification: (userID) => {
        let verify = new Account({
            userID: userID
        })
        return verify;
    },
    getUpdateCustomerTaskAlertQuery: (params) => {

        return CustomersSettings.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    'taskAlerts.alerts': params.taskAlert
                }
            }).exec()
    },
    getInsertCustomerCustomAlertsQuery: (params, alertID) => {
        let alertType = {
            inPerson: params.alertType.inPerson,
            remote: params.alertType.remote
        }
        let customAlerts = [{
            alertID: alertID,
            alertType: alertType,
            taskKeyword: params.taskKeyword,
            taskName: params.taskName,
            taskLoc: params.taskLoc,
            taskLocation: params.taskLocation,
            taskDistance: params.taskDistance
        }]
        return CustomersSettings.updateOne({ userID: params.userID },
            { $push: { 'taskAlerts.customAlerts': customAlerts } }).exec()
    },
    updateCustomerCustomAlertsQuery: (params) => {
        let alertType = {
            inPerson: params.alertType.inPerson,
            remote: params.alertType.remote
        }

        return CustomersSettings.updateOne({ userID: params.userID, 'taskAlerts.customAlerts.alertID': params.alertID },
            {
                $set: {
                    'taskAlerts.customAlerts.$.alertType': alertType,
                    'taskAlerts.customAlerts.$.taskName': params.taskName,
                    'taskAlerts.customAlerts.$.taskKeyword': params.taskKeyword,
                    'taskAlerts.customAlerts.$.taskLoc': params.taskLoc,
                    'taskAlerts.customAlerts.$.taskLocation': params.taskLocation,
                    'taskAlerts.customAlerts.$.taskDistance': params.taskDistance
                }
            }).exec()
    },

    getDeleteCustomTaskAlert: (params) => {
        return CustomersSettings.updateOne({ userID: params.userID },
            { $pull: { "taskAlerts.customAlerts": { "alertID": params.alertID } } }).exec()
    },

    getUpdateCustomerSearchConfig: (params) => {
        let search_Configurations = {
            lat: params.lat,
            long: params.long,
            radius: params.radius,
            maxPrice: params.maxPrice,
            minPrice: params.minPrice,
            taskTypes: params.taskTypes,
            locationName: params.locationName,
            hideAssignedTask: params.hideAssignedTask
        }
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    search_Configurations: search_Configurations
                }
            }).exec()
    },
    getJobsBasedOnCustomerSearchConfig: (params) => {
        var postType;
        if (params.taskTypes === 'In Person') {
            postType = [false];
        } else if (params.taskTypes === 'Remote') {
            postType = [true];
        } else {
            postType = [true, false];
        }
        var postStatus;
        if (params.hideAssignedTask === 'true') {
            postStatus = ['Post', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated']
        } else {
            postStatus = ['Post', 'Assigned', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated']
        }
        // var limit = params.limit || 500;
        // console.log('limit value..'+limit);
        // get the max distance or set it to 100 kilometers
        var maxDistance = params.radius || 5000;
        console.log('max distance...' + maxDistance);
        maxDistance /= 6371;        
        console.log('max distance...' + maxDistance);
        // get coordinates [ <longitude> , <latitude> ]
        var coords = [];
        coords[0] = params.lat;
        coords[1] = params.long;
        var query = {
            $and: [{ loc: { $near: coords, $maxDistance: maxDistance } }, { 'budget.budget': { $gte: params.minPrice, $lte: params.maxPrice } }, {
                canThisTaskRemote: { $in: postType }
            }, {
                post_Status: { $in: postStatus }
            },
            {
                $or: [{ postTitle: { $regex: params.search_term, $options: 'i' } }, {
                    location: { $regex: params.search_term, $options: 'i' }
                }, {
                    'category.categoryName': { $regex: params.search_term, $options: 'i' }
                }
                ]
            }]
        }
        return PostJob.find(query, { _id: 0, __v: 0 }).sort({ '_id': -1 }).skip( params.pageNo > 0 ? ( ( params.pageNo - 1 ) * params.size ) : 0 )
        .limit( params.size ).exec()
    },
    customerProfileUpdateQuery: (params, imageName) => {

        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    profilePic: imageName
                }
            }).exec()
    },
    customerAccountUpdateQuery: (params) => {
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    BankAccountDetailes: {
                        Accountnumber: params.Accountnumber,
                        Accountholdername: params.Accountholdername,
                        BSB: params.BSB
                    }
                }
            }).exec()
    },
    customerAddressUpdateQuery: (params) => {
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    BillingAddress: {
                        AddressLine1: params.AddressLine1,
                        AddressLine2: params.AddressLine2,
                        Suburb: params.Suburb,
                        State: params.State,
                        Postcode: params.Postcode,
                        Country: params.Country

                    }
                }
            }).exec()
    },
    customerDOBUpdateQuery: (params) => {
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    dob: params.dob
                }
            }).exec()
    },
    customerMobilenoUpdateQuery: (params, otp) => {
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    phoneNumber: params.phoneNumber
                }
            }).exec()
    },
    getAllCustomersQuery: (arr) => {
        return Customers.find({ userID: { $in: arr } }, {
            _id: 0, __v: 0,
            search_Configurations: 0,
            postTask: 0,
            completeTask: 0,
            dob: 0,
            verification_status: 0,
            prefer_language: 0,
            login_status: 0,
            isProfileUpdate: 0,
            BankAccountDetailes: 0,
            BillingAddress: 0,
            password: 0,
            otp: 0,
            register_type: 0,
            register_time: 0,
            loc: 0,
            address: 0,
            phoneNumber: 0,
            Google: 0,
            Facebook: 0,
            otp_time: 0,
        }
        ).exec()
    },
    getNotificationsByUserIDQuery: (params) => {
        return notify.find({ userID: new RegExp(params.userID, 'i') }).exec()
    },
    addingNewDeviceIdTokenQuery: (params) => {
        if (params.deviceType === 'web') {
            var obj = new notify({
                userID: params.userID,
                devices: {
                    web: [{
                        deviceID: params.deviceID,
                        deviceToken: params.deviceToken,
                        login: true
                    }]
                }
            });
            return obj;
        } else {
            var obj = new notify({
                userID: params.userID,
                devices: {
                    mobile: [{
                        deviceID: params.deviceID,
                        deviceToken: params.deviceToken,
                        login: true
                    }]
                }
            });
            return obj;
        }

    },
    updateDeviceIdTokenQuery: (params) => {
        if (params.deviceType === 'web') {
            return notify.updateOne(
                {
                    'userID': params.userID,
                    'devices.web.deviceID': params.deviceID
                },
                {
                    '$set':
                    {
                        'devices.web.$': {
                            deviceToken: params.deviceToken,
                            deviceID: params.deviceID,
                            login: true
                        }

                    }
                }).exec()
        } else {
            return notify.updateOne(
                {
                    'userID': params.userID,
                    'devices.mobile.deviceID': params.deviceID
                },
                {
                    '$set':
                    {
                        'devices.mobile.$': {
                            deviceToken: params.deviceToken,
                            deviceID: params.deviceID,
                            login: true
                        }

                    }
                }).exec()
        }

    },
    updateDeviceIdTokenByDeviceIdQuery: (params, ID) => {
        if (params.deviceType === 'web') {
            return notify.updateOne(
                {
                    _id: ID,
                    userID: new RegExp(params.userID, 'i')
                },
                {
                    "$push": {

                        "devices.web": {
                            deviceID: params.deviceID,
                            deviceToken: params.deviceToken,
                            login: true
                        }
                    }

                }).exec()

        } else {
            return notify.updateOne(
                {
                    _id: ID,
                    userID: new RegExp(params.userID, 'i')
                },
                {
                    $push: {

                        "devices.mobile": {
                            deviceID: params.deviceID,
                            deviceToken: params.deviceToken,
                            login: true
                        }
                    }

                }).exec()
        }
    },
    updateUserAccountProfileQuery: (params) => {
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    loc: [params.latitude, params.longitude],
                    dob: params.birthDay,
                    aboutMe: params.aboutMe,
                    phoneNumber: params.businessNumber,
                    address: params.address,
                    postTask: params.postTask,
                    completeTask: params.completeTask,
                    gallery: params.gallery,
                }
            }).exec()
    },
    logoutUserFromDeviceQuery: (params) => {
        if (params.deviceType === 'web') {
            return notify.updateMany({
                'userID': new RegExp(params.userID, 'i'),
                //'devices.web.deviceID': params.deviceID,
                'devices.web.deviceToken': params.deviceToken
            },
                {
                    '$set':
                    {

                        'devices.web.$.login': false
                    }
                }
            ).exec()
        } else {
            return notify.updateMany({
                'userID': new RegExp(params.userID, 'i'),
                'devices.mobile.deviceID': params.deviceID,
                'devices.mobile.deviceToken': params.deviceToken
            },
                {
                    '$set':
                    {

                        'devices.mobile.$.login': false
                    }
                }
            ).exec()
        }
    },
    updateCustomerActiveTimeStampQuery: (params) => {
        return Customers.updateOne({ userID: params.userID },
            {
                $set: {
                    activeTimestamp: params.activeTimeStamp
                }
            }).exec()
    },
    deleteFilePathFromGalleryArrayQuery: (userID, path) => {
        return Customers.updateOne({ userID: userID },
            { $pull: { gallery: { $in: [path] } } },
            { multi: true }
        ).exec()
    },
    insertNewUserToCouponsQuery: (params) => {
        var coupon = new Coupons({
            userID: params.userID
        })
        return coupon;
    },
    insertCouponsToNewUsersQuery: (userID, couponCode) => {
        const timestamp = new Date().getTime().toString()
        var coupon = {
            couponCode: couponCode,
            couponAmount: '5',
            applied: false,
            timeStamp: timestamp
        }
        return Customers.updateOne({ userID: userID },
            {
                $push: {
                    coupons: coupon
                }
            }
        ).exec()
    },
    getUserCouponByCouponCode: (params) => {
        return Customers.findOne({ userID: params.userID, "coupons.couponCode": params.couponCode },
            { _id: 0, "coupons.$": 1 }).exec()
    },
    FetchQuery: () => {
        return Customers.find({}, {id: 0, _v: 0}).exec()
    },
    getReferQuery:(userid,referralCode) =>{

        return Customers.updateMany({userID: userid},
            {
                $set:{

                    referralCode: referralCode
                }
            }).exec()
    },
    checkReferralsignup : (params) =>{
        return Customers.findOne( { referralCode : params.signupReferralBy}, {id: 0, _v: 0}).exec() 
    },
    fetchUserByReferralCode: (params) =>{
        return Customers.findOne( { referralCode : params.referralCode}, {id: 0, _v: 0}).exec() 
    },
    fetchRefferalUsersQuery:(params) =>{
        return Customers.find({'signupReferralInfo.referralCode' : new RegExp('^' + params.referralCode + '$', "i"),verification_status: true,isProfileUpdate: true},
        {
            isGivenAppRatings: 0,
            gallery:  0,
            accountVerificationStatus: 0,
            businessNumber:0,
            aboutMe: 0,
            isActive: 0,
            coupons: 0,
            isOldUser: 0,
            referralCode: 0,
            signupReferralInfo: 0,
            search_Configurations: 0,
            postTask: 0,
            completeTask: 0,
            dob: 0,
            verification_status: 0,
            prefer_language: 0,
            login_status: 0,
            isProfileUpdate: 0,
            BankAccountDetailes: 0,
            BillingAddress: 0,
            password: 0,
            otp: 0,
            register_type: 0,
            loc: 0,
            phoneNumber: 0,
            Google: 0,
            Facebook: 0,
            otp_time: 0,
           _id : 0,
        __v: 0}).exec()
    },
    fetchReferralEarnings:(params)=>{
        return Earnings.find({ referralCode : new RegExp('^' + params.referralCode + '$', "i")},{_id: 0, __v: 0}).exec()
    },
    fetchTotalJobCountQuery:(params)=>{
        var postType;
        if (params.taskTypes === 'In Person') {
            postType = [false];
        } else if (params.taskTypes === 'Remote') {
            postType = [true];
        } else {
            postType = [true, false];
        }
        var postStatus;
        if (params.hideAssignedTask === 'true') {
            postStatus = ['Post', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated']
        } else {
            postStatus = ['Post', 'Assigned', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated']
        }
        // var limit = params.limit || 500;
        // console.log('limit value..'+limit);
        // get the max distance or set it to 100 kilometers
        var maxDistance = params.radius || 5000;
        console.log('max distance...' + maxDistance);
        maxDistance /= 6371;
        // get coordinates [ <longitude> , <latitude> ]
        var coords = [];
        coords[0] = params.lat;
        coords[1] = params.long;
        var query = {
            $and: [{ loc: { $near: coords, $maxDistance: maxDistance } }, { 'budget.budget': { $gte: params.minPrice, $lte: params.maxPrice } }, {
                canThisTaskRemote: { $in: postType }
            }, {
                post_Status: { $in: postStatus }
            },
            {
                $or: [{ postTitle: { $regex: params.search_term, $options: 'i' } }, {
                    location: { $regex: params.search_term, $options: 'i' }
                }, {
                    'category.categoryName': { $regex: params.search_term, $options: 'i' }
                }
                ]
            }]
        }
        return PostJob.find(query, { _id: 0, __v: 0 }).count().exec()
    }
   
}

module.exports = CustomersDBQueries;
