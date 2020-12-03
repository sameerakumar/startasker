const Customers = require('../../app/Models/Customers');
const PostJob = require('../../app/Models/PostJob');
const notify = require('../../app/Models/Notifications');
const Inbox = require('../../app/Models/NotificationsInbox');
const Settings = require('../../app/Models/CustomerSettings');
const GenerateID = require('../Core/IDGenerate');
var postJobsDBQuries = {
    getUserQueryFromUserId: (userID) => {
        return Customers.findOne({ userID: new RegExp('^' + userID + '$', "i") }).exec()
    },
    getAllCustomersQuery: () => {
        return Customers.find({}, { _id: 0, __v: 0 }).exec()
    },
    newPostJobsInserQuery: (params, postID, images) => {

        let budgetType = {
            Total: params.budgetType.Total,
            HourlyRate: params.budgetType.HourlyRate
        }
        let budget = {
            budgetType: budgetType,
            budget: params.budget,
            Hours: params.Hours,
            pricePerHour: params.pricePerHour
        }
        let category = {
            categoryId: params.category.categoryId,
            categoryName: params.category.categoryName
        }
        let posttimeStamp = new Date().getTime().toString();
        let posttimeStamp1 = new Date();
        let postenddate = posttimeStamp1.getTime() + 30 * 86400000;
        let postjobs = new PostJob({
            postID: postID,
            userID: params.userID,
            category: category,
            budget: budget,
            postTitle: params.postTitle,
            describeTaskInDetails: params.describeTaskInDetails,
            numberOfWorkers: params.numberOfWorkers,
            canThisTaskRemote: params.canThisTaskRemote,
            location: params.location,
            loc: [params.latitude, params.longitude],
            mustHaves: params.mustHaves,
            postedDate: posttimeStamp,
            postendDate: postenddate,
            taskDate: params.taskDate,
            convenientTimings: params.convenientTimings,
            post_Status: params.post_Status,
            attachments: images
        })
        return postjobs;
    },

    getPostJobQueryFromId: (params) => {
        var query = {
            $or: [{
                userID: { $regex: params.userID, $options: 'i' }
            }, {
                postID: { $regex: params.userID, $options: 'i' }
            }]
        }
        return PostJob.find(query, { _id: 0, __v: 0 }).exec()
    },
    getPostJobQueryFromUserID: (userID) => {

        return PostJob.find({ userID: new RegExp('^' + userID + '$') }, { _id: 0, __v: 0 }).exec()
    },
    getPostJobQueryFromPostId: (postId) => {

        return PostJob.findOne({ postID: new RegExp('^' + postId + '$') }, { _id: 0, __v: 0 }).exec()
    },
    updatePostJobsQueryParams: (params, images) => {

        let budgetType = {
            Total: params.budgetType.Total,
            HourlyRate: params.budgetType.HourlyRate
        }
        let budget = {
            budgetType: budgetType,
            budget: params.budget,
            Hours: params.Hours,
            pricePerHour: params.pricePerHour
        }
        let category = {
            categoryId: params.category.categoryId,
            categoryName: params.category.categoryName
        }
        let postModifyTimeStamp = new Date().getTime().toString();
        return PostJob.updateOne({ postID: new RegExp('^' + params.postID + '$', 'i') }, {

            budget: budget,
            category: category,
            postTitle: params.postTitle,
            describeTaskInDetails: params.describeTaskInDetails,
            numberOfWorkers: params.numberOfWorkers,
            canThisTaskRemote: params.canThisTaskRemote,
            location: params.location,
            loc: [params.latitude, params.longitude],
            mustHaves: params.mustHaves,
            taskDate: params.taskDate,
            convenientTimings: params.convenientTimings,
            post_Status: params.post_Status,
            attachments: images,
            postModifyDate: postModifyTimeStamp
        })

    },
    //browse job function starts from here...
    getBrowseJobQueryFromName: (params) => {
        var query = {
            $and: [{
                postTitle: { $regex: params.keyword, $options: 'i' }
            }, {
                location: { $regex: params.location, $options: 'i' }
            }, {
                "category.categoryId": { $in: params.categories }
            }]
        }
        return PostJob.find(query, { _id: 0, __v: 0 }).skip( params.pageNo > 0 ? ( ( params.pageNo - 1 ) * params.size ) : 0 )
        .limit( params.size ).exec()
    },
    getBrowseJobQueryFromCategory: (params) => {
        var postStatus = ['Post', 'Assigned', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated'];
        var coords = [];
        coords[1] = params.latitude;
        coords[0] = params.longitude;
        var maxDistance = params.radius || 10000;
        console.log('max distance...' + maxDistance);
        maxDistance /= 6371;
        var query = {
            $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
                { "category.categoryId": { $in: params.categories } },
            {location: {$regex : ".*"+params.location+".*"}},
            { post_Status: { $in: postStatus } }]
        }

        return PostJob.find(query, { _id: 0, __v: 0 }).skip( params.pageNo > 0 ? ( ( params.pageNo - 1 ) * params.size ) : 0 )
        .limit( params.size ).exec()

    },
    getBrowseJobQueryFromLocation: (params) => {
        var postStatus = ['Post', 'Assigned', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated'];
        var coords = [];
        coords[1] = params.latitude;
        coords[0] = params.longitude;
        var maxDistance = params.radius || 10000;
        console.log('max distance...' + maxDistance);
        maxDistance /= 6371;
        var query = {
            $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
                { location: { $regex: params.location, $options: 'i' } },
            { post_Status: { $in: postStatus } }]
        }
        return PostJob.find(query, { _id: 0, __v: 0 }).skip( params.pageNo > 0 ? ( ( params.pageNo - 1 ) * params.size ) : 0 )
        .limit( params.size ).exec()
    },
    getBrowseJobQueryFromKeyword: (params) => {
        var postStatus = ['Post', 'Assigned', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated']
        var coords = [];
        coords[1] = params.latitude;
        coords[0] = params.longitude;
        var maxDistance = params.radius || 10000;
        console.log('max distance...' + maxDistance);
        maxDistance /= 6371;
        var query = {
            $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
                { postTitle: { $regex: params.keyword, $options: 'i' } },
            {location: {$regex : ".*"+params.location+".*"}},
            { post_Status: { $in: postStatus } }]
        }
        return PostJob.find(query, { _id: 0, __v: 0 }).skip( params.pageNo > 0 ? ( ( params.pageNo - 1 ) * params.size ) : 0 )
        .limit( params.size ).exec()
    },
    //ends here
    getUpdatePostJobStatusAsOpenQuery: (postID) => {
        return PostJob.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                post_Status: 'Open',
            }
        }).exec()
    },
    getDeletePostJobQuery: (postID) => {
        return PostJob.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                post_Status: 'Cancel',
            }
        }).exec()
    },
    getUpdatePostJobQuery: (postID) => {
        return PostJob.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                post_Status: 'Expired',
            }
        }).exec()
    },
    getAddPostToFavouriteQuery: (postID, favourite) => {
        return PostJob.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                favourite: favourite,
            }
        }).exec()
    },
    getPushCommentsToPostJobQuery: (params) => {
        // let authorMessages = [{
        //     author_email: params.author_email,
        //     author_comment: params.author_comment,
        //     comment_date: params.timeStamp,
        // }]
        // let comments = {
        //     author: params.author,
        //     author_email: params.author_email,
        //     authorMessages: authorMessages,
        //     comment_date: params.timeStamp
        // }
		let timeStamp = new Date().getTime().toString();
        let comments = {
            author: params.author,
            author_email: params.author_email,
            author_url: params.author_url,
            author_comment: params.author_comment,
            comment_date: timeStamp,
            comment_date_gmt: timeStamp
        }
        return PostJob.updateOne(
            { postID: params.postID },
            { $push: { comments: comments } }
        );

    },
    getGivingReplayToCommentsMessageQuery: (params) => {
        let timeStamp = new Date().getTime().toString();
        let messages = {
            userID: params.userID,
            message: params.message,
            timestamp: timeStamp
        }
        return PostJob.updateOne({ postID: params.postID, "comments.commentUserID": params.offeredUserID },
            { $push: { "comments.$.authorMessages": messages } }
            // { $push: { '$offers.messages.authorMessages': messages } }
        );
    },
    getAllPostJobsQuery: () => {
        return PostJob.find({}, { _id: 0, __v: 0 }).exec()
    },

    getUpdatePostJobAsFilledQuery: (params) => {
        return PostJob.updateOne({ postID: new RegExp(params.postID, 'i') }, {
            $set: {
                filled: params.filled
            }
        }).exec()
    },
    getOfferQuery: (params, ratings) => {
        let TimeStamp = new Date().getTime().toString();
        let authorMessages = [{
            userID: params.offeredUserID,
            timestamp: TimeStamp,
            message: params.message,
            name: params.authorName,
            profilePic: params.authorProfilePic
        }]
        let offers = {
            authorRatings: ratings,
            offeredUserID: params.offeredUserID,
            authorProfilePic: params.authorProfilePic,
            authorMessages: authorMessages,
            authorName: params.authorName,
            budget: params.budget,
            isTaskerHired: false,
            isTaskerWithDraw: false
        }
        return PostJob.updateOne(
            { postID: params.postID },
            { $push: { offers: offers } }
        );

    },
    getGivingReplayToOfferMessageQuery: (params) => {
        let timeStamp = new Date().getTime().toString();
        let messages = {
            userID: params.userID,
            message: params.message,
            name: params.name,
            profilePic: params.profilePic,
            timestamp: timeStamp
        }
        return PostJob.updateOne({ postID: params.postID, "offers.offeredUserID": params.offeredUserID },
            { $push: { "offers.$.authorMessages": messages } }
            // { $push: { '$offers.messages.authorMessages': messages } }
        );
    },
    getUpdateJobAppliedCount: (params, count) => {
        return PostJob.updateOne({ postID: new RegExp(params.postID, 'i') }, {
            $set: {
                jobAppliedCount: count
            }
        }).exec()
    },
    getPostJobAggregateQuery: (params) => {
        var pageNumber = params.pageNo;
        var nPerPage = params.size;
        return PostJob.aggregate([
            {
                $match:{
                    post_Status: { $nin: ['Expired','Cancel','Draft']},
                    location: {$regex : ".*"+params.location+".*"}
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "userID",
                    foreignField: "userID",
                    as: "userInfo"
                }
            },
            { "$unwind": "$userInfo" },
            {
                $project: {
                    "_id": 0,
                    "budget": 1,
                    "numberOfWorkers": 1,
                    "canThisTaskRemote": 1,
                    "mustHaves": 1,
                    "taskDate": 1,
                    "convenientTimings": 1,
                    "attachments": 1,
                    "filled": 1,
                    "jobAppliedCount": 1,
                    "favourite": 1,
                    "comments": 1,
                    "offers": 1,
                    "postID": 1,
                    "userID": 1,
                    "category": 1,
                    "postTitle": 1,
                    "describeTaskInDetails": 1,
                    "location": 1,
                    "loc": 1,
                    "postedDate": 1,
                    "postendDate": 1,
                    "post_Status": 1,
                    "postModifyDate": 1,
                    "userInfo.firstName": 1,
                    "userInfo.lastName": 1,
                    "userInfo.profilePic": 1,
                    "userInfo.userID": 1
                }
            },
            {
                $sort: {
                    'postedDate': -1
                }
            }
        ]).skip(( pageNumber - 1 ) * nPerPage).limit( nPerPage * 1).exec()
    },
    getPostJobAggregateQueryByPostID: (postID) => {
        return PostJob.aggregate([
            {
                $match: {
                    postID: new RegExp( "^" + postID + "$", 'i')
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "userID",
                    foreignField: "userID",
                    as: "userInfo"
                }
            },
            { "$unwind": "$userInfo" },
            {
                $project: {
                    "_id": 0,
                    "budget": 1,
                    "numberOfWorkers": 1,
                    "canThisTaskRemote": 1,
                    "mustHaves": 1,
                    "taskDate": 1,
                    "convenientTimings": 1,
                    "attachments": 1,
                    "filled": 1,
                    "jobAppliedCount": 1,
                    "favourite": 1,
                    "comments": 1,
                    "offers": 1,
                    "postID": 1,
                    "userID": 1,
                    "category": 1,
                    "postTitle": 1,
                    "describeTaskInDetails": 1,
                    "location": 1,
                    "loc": 1,
                    "postedDate": 1,
                    "postendDate": 1,
                    "post_Status": 1,
                    "postModifyDate": 1,
                    "userInfo.firstName": 1,
                    "userInfo.lastName": 1,
                    "userInfo.profilePic": 1,
                    "userInfo.userID": 1
                }
            }
        ]).exec()
    },
    updateOffersDataQuery: (params) => {
        return PostJob.updateOne({ postID: params.postID, "offers.offeredUserID": params.offeredUserID },
            {
                $set: { "offers.$.budget": params.budget, "offers.$.authorMessages.0.message": params.message }
            }).exec()
    },
	updateProviderRatingsToOffersQuery:(params,ratings)=>{
        return PostJob.updateMany({"offers.offeredUserID": params.offeredUserID},
        {
            $set: {"offers.$.authorRatings" : ratings}
        }).exec()
    },
    cancelOfferDataQuery: (params) => {
        return PostJob.updateOne({ postID: params.postID },
            {
                $pull: { offers: { offeredUserID: params.offeredUserID } }
            }).exec()
    },
    getUserTakenOtherOffers: (params) => {        
        var query = {
            $or: [{
                'offers.offeredUserID': { $regex: params.userID, $options: 'i' }
            }]
        }

        return PostJob.find(query, { _id: 0, __v: 0 }).exec()

    },
    getPostedCustomersInfoQuery: (arr) => {
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
            isGivenAppRatings: 0,
            gallery: 0,
            paymentIdVerification: 0,
            businessNumber: 0,
            aboutMe: 0,
            isActive: 0,
        }
        ).exec()
    },
    getNearByLocationUsersQuery: (params) => {
        var array = [params.userID];
        var coords = [];
        coords[0] = params.latitude;
        coords[1] = params.longitude;
        var maxDistance = 10000;
        maxDistance /= 6371;
        query = {
            $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
            {
                userID: { $nin: array }
            },
            {
                isProfileUpdate: { $in : [true]}
            }
            ]
        }
        return Customers.find(query, { _id: 0, __v: 0 }).exec()
    },
    getUserNotificationsQuery: (userID) => {
        return notify.find({ userID: { $regex: userID, $options: 'i' } }).exec();
    },
    addingPushNotificationsToInboxQuery: (userID, notifyData) => {
        let timeStamp = new Date().getTime().toString();
        var notifyID = "notify_" + new Date().getTime().toString() + GenerateID.makeId();
        //console.log('notify data...', notifyData);
        notifyData.notifyID = notifyID;
        notifyData.timeStamp = timeStamp;
        notifyData.isRead = false;
        //console.log('after adding timestamp object...', notifyData);
        return Inbox.updateOne({ userID: userID },
            { $push: { "notifyInbox": notifyData } }
        ).exec();
    },
    getUserSettingsBasedOnUserIDQuery: (userID) => {
        return Settings.findOne({ userID: { $regex: userID, $options: 'i' } }).exec();
    },
    getMatchedCategorySettingsQuery: (category, userID) => {
        return Settings.aggregate([
            {
                $match: {
                    'userID': userID
                }
            },
            {
                $match: {
                    'taskAlerts.customAlerts.taskName': category
                }
            },
            {
                $project: {
                    'taskAlerts.customAlerts': {
                        $filter: {
                            input: '$taskAlerts.customAlerts',
                            as: 'customAlerts',
                            cond: {
                                $eq: [
                                    '$$customAlerts.taskName', category
                                ]
                            }
                        }
                    }, _id: 0
                }
            }]).exec()
    },
    fetchTotalJobCountQuery:(params)=>{
        var query = {
            $and: [{'post_Status' : {$nin : ['Expired','Cancel','Draft']},
            location: {$regex : ".*"+params.location+".*"}}]
        }
        return PostJob.find(query).countDocuments().exec()
    },
    fetchTotalBrowseJobCountQuery:(params)=>{
        var postStatus = ['Post', 'Assigned', 'Open', 'Completed', 'Overdue', 'Closed', 'Allocated'];
        var coords = [];
        coords[1] = params.latitude;
        coords[0] = params.longitude;
        var maxDistance = params.radius || 10000;
        console.log('max distance...' + maxDistance);
        maxDistance /= 6371;
        var query;
        if (params.keyword != "" && params.location != "" && params.categories.length === 0){
            query = {
                $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
                    { postTitle: { $regex: params.keyword, $options: 'i' } },
                {location: {$regex : ".*"+params.location+".*"}},
                { post_Status: { $in: postStatus } }]
            }
        }else if (params.keyword === "" && params.location != "" && params.categories.length === 0){
            query = {
                $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
                    { location: { $regex: params.location, $options: 'i' } },
                { post_Status: { $in: postStatus } }]
            }
        }else if(params.keyword === "" && params.location != "" && params.categories.length > 0){
            query = {
                $and: [{ loc: { $near: coords, $maxDistance: maxDistance } },
                    { "category.categoryId": { $in: params.categories } },
                {location: {$regex : ".*"+params.location+".*"}},
                { post_Status: { $in: postStatus } }]
            }
        }else{
            query = {
                $and: [{
                    postTitle: { $regex: params.keyword, $options: 'i' }
                }, {
                    location: { $regex: params.location, $options: 'i' }
                }, {
                    "category.categoryId": { $in: params.categories }
                }]
            }
        }
        return PostJob.find(query).countDocuments().exec();
    },
    getUserUnreadNotifificationCountAggregateQuery: (userID) => {
        return Inbox.aggregate([          
            {
                $match: {                   
                        userID: new RegExp(userID, 'i')
                                       
                }
            },
            { $unwind : '$notifyInbox'},
            {
                $match : {
                    'notifyInbox.isRead' : false
                }
            }
        ]).exec()
    }    
}

module.exports = postJobsDBQuries;