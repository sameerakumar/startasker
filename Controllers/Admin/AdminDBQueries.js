const Admin = require('../../app/Models/Admin');
const Customers = require('../../app/Models/Customers');
const PostJob = require('../../app/Models/PostJob');
const Bookings = require('../../app/Models/BookingsData');
const AccountVerification = require('../../app/Models/AccountVerification');
const Review = require('../../app/Models/Review');
const Referral = require('../../app/Models/ReferAndEarn');
const notificationDB = require('../../app/Models/Notifications');
const Inbox = require('../../app/Models/NotificationsInbox');
const AdminNotifyInbox = require('../../app/Models/AdminNotificationsInbox');
const GenerateID = require('../Core/IDGenerate');
const CategoryDb = require('../../app/Models/Categories');
var AdminDBQueries = {

    getQuery: (params) => {
        var query = {
            $or: [{
                userID: { $regex: '^' + params.userID + '$', $options: 'i' }
            }
            ]
        }
        return Admin.findOne(query, { _id: 0, __v: 0 }).exec()
    },
    insertQuery: (params) => {
        let admin = new Admin({
            userID: params.userID,
            password: params.password
        });
        return admin
    },
    adminLogin: (params) => {
        var query = {
            $and: [{
                userID: {
                    $regex: '^' + params.userID + '$',
                    $options: 'i'
                }
            }, { password: { $regex: '^' + params.password + '$', $options: 'i' } }]
        }
        return Admin.findOne(query, { _id: 0, __v: 0, loc: 0, registerTime: 0 }).exec()
    },
    adminPasswordUpdate: (params) => {
        return Admin.updateOne({
            userID: new RegExp(params.userID, 'i')
        },
            {
                $set: {
                    password: params.password,
                }
            }).exec()
    },
    deleteQuery: (params) => {
        return Admin.deleteOne({ userID: new RegExp('^' + params.userID + '$') }).exec()
    },
    FetchQuery: (userID) => {
        var query = {
            $or: [{
                userID: { $regex: userID, $options: 'i' }
            }

            ]
        }
        return Customers.findOne(query, { _id: 0, __v: 0 }).exec()
    },

    BookingFetchQuery: (params) => {
        return Bookings.find({}, { _id: 0, __v: 0 }).exec()
    },
    FetchpostersQuery: (params) => {
        return Customers.find({ postTask: true }, { _id: 0, __v: 0 }).exec()
    },
    FetchtaskersQuery: (params) => {
        return Customers.find({ completeTask: true }, { _id: 0, __v: 0 }).exec()
    },
    countQuery: (params, dates) => {
        var poster = false;
        var tasker = false;
        if (params.type === 'Tasker') {
            tasker = [true];
            poster = [true, false];


        } else if (params.type === 'Poster') {
            poster = [true];
            tasker = [true, false];
        }
        else {
            poster = [true, false];
            tasker = [false, true];
        }

        var Status;
        if (params.sortBy === 'Verified') {
            Status = ['Verified'];
        } else if (params.sortBy === 'Rejected') {
            Status = ['Rejected'];
        } else if (params.sortBy === 'Unverified') {
            Status = ['Unverified'];
        } else if (params.sortBy === 'Pending') {
            Status = ['Pending'];
        }
        else {
            Status = ['Verified', 'Rejected', 'Unverified', 'Pending']
        }
        var query;
        if (dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ register_time: { $gte: frmDate.toString(), $lte: toDate.toString() } },
                    { postTask: { $in: poster } }, { completeTask: { $in: tasker } }, {
                        accountVerificationStatus: { $in: Status }
                    }, { verification_status: true }, { isProfileUpdate: true }],

                }
            } else {
                query = {
                    $and: [{ register_time: { $gte: params.fromdate, $lte: params.todate } },
                    { postTask: { $in: poster } }, { completeTask: { $in: tasker } }, {
                        accountVerificationStatus: { $in: Status }
                    }, { verification_status: true }, { isProfileUpdate: true }]
                }
            }

        } else {
            query = {
                $and: [{ postTask: { $in: poster } }, { completeTask: { $in: tasker } }, {
                    accountVerificationStatus: { $in: Status }
                }, { verification_status: true }, { isProfileUpdate: true }],

            }
        }
        return Customers.countDocuments(query).exec()
    },
    bookingscountQueryy: (params, Dates) => {
        var postStatus;
        if (params.type === 'Completed') {
            postStatus = ['true']
        } else if (params.type === 'Pending') {
            postStatus = ['false']
        } else {
            postStatus = ['true', 'false']
        }
        var query;
        if (Dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ paymentDate: { $gte: frmDate.toString(), $lte: toDate.toString() } }, {
                        isTaskCompleted: { $in: postStatus }
                    }
                    ]
                }
            } else {
                query = {
                    $and: [{ paymentDate: { $gte: params.fromdate, $lte: params.todate } }, {
                        isTaskCompleted: { $in: postStatus }
                    }
                    ]
                }
            }
        } else {
            query = {
                $and: [{
                    isTaskCompleted: { $in: postStatus }
                },
                ]
            }
        }
        return Bookings.countDocuments(query).exec()
    },
    referralcountQuery: (params, dates) => {
        var isTransferStatus;
        if (params.type === 'Paid') {
            isTransferStatus = [true];
        } else if (params.type === 'UnPaid') {
            isTransferStatus = [false];
        } else {
            isTransferStatus = [true, false]
        }
        var query;
        if (dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ postedDate: { $gte: frmDate.toString(), $lte: toDate.toString() } }, {
                        isTransferStatus: { $in: isTransferStatus }
                    },
                    ]
                }
            } else {
                query = {
                    $and: [{ postedDate: { $gte: params.fromdate, $lte: params.todate } }, {
                        isTransferStatus: { $in: isTransferStatus }
                    },
                    ]
                }
            }
        } else {
            query = {
                $and: [{
                    isTransferStatus: { $in: isTransferStatus }
                }
                ]
            }
        }
        return Referral.countDocuments(query).exec()
    },
    searchingcountQuery: (params) => {
        var query = {
            $or: [{ firstName: new RegExp("^" + params.userID, 'i') },
            { lastName: new RegExp("^" + params.userID, 'i'),
            $and: [{accountVerificationStatus: { $in: ['Verified', 'Rejected', 'Unverified', 'Pending']} },
            { verification_status: true }, { isProfileUpdate: true }]}]
        }
        return Customers.countDocuments(query).exec()
    },
    getCustomerDetails: (params) => {
        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        return Customers.find()
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
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
    FetchcommentsQuery: (params) => {
        return PostJob.find({ "comments.userID": params.userID }).exec()
    },
    FetchpostjobQuery: (params) => {
        return PostJob.find({ "userID": params.userID }).exec()
    },
    postjobscountQuery: (params, dates) => {
        var postStatus;
        if (params.taskStatus === 'Open') {
            postStatus = ['Open']
        } else if (params.taskStatus === 'Assigned') {
            postStatus = ['Assigned']
        } else if (params.taskStatus === 'Completed') {
            postStatus = ['Completed']

        } else if (params.taskStatus === 'Cancel') {
            postStatus = ['Cancel']
        } else {
            postStatus = ['Open', 'Assigned', 'Completed', 'Cancel']
        }
        var query;
        if (dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ postedDate: { $gte: frmDate.toString(), $lte: toDate.toString() } }, {
                        post_Status: { $in: postStatus }
                    }
                    ]
                }
            } else {
                query = {
                    $and: [{ postedDate: { $gte: params.fromdate, $lte: params.todate } }, {
                        post_Status: { $in: postStatus }
                    }
                    ]
                }
            }

        } else {
            query = {
                $and: [{ post_Status: { $in: postStatus } }],

            }
        }
        return PostJob.countDocuments(query).exec();
    },
    getAllPostJobsQuery: (params) => {

        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        return PostJob.find()
            .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage)
    },
    fetchBookingsQuery: (params, Dates) => {
        var postStatus;
        if (params.type === 'Completed') {
            postStatus = ['true']
        } else if (params.type === 'Pending') {
            postStatus = ['false']
        } else {
            postStatus = ['true', 'false']
        }
        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        var query;
        if (Dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ paymentDate: { $gte: frmDate.toString(), $lte: toDate.toString() } }, {
                        isTaskCompleted: { $in: postStatus }
                    }
                    ]
                }
            } else {
                query = {
                    $and: [{ paymentDate: { $gte: params.fromdate, $lte: params.todate } }, {
                        isTaskCompleted: { $in: postStatus }
                    }
                    ]
                }
            }
        } else {
            query = {
                $and: [{
                    isTaskCompleted: { $in: postStatus }
                },
                ]
            }
        }

        return Bookings.find(query).skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage).sort({ paymentDate: -1 }).exec()
    },
    GetQuery: (params) => {
        return PostJob.find({ "offers.offeredUserID": params.userID }).exec()
    },
    getTaskQuery: (params) => {
        var query = {
            $or: [{
                postID: { $regex: '^' + params.postID + '$', $options: 'i' }
            }
            ]
        }
        return PostJob.findOne(query, { _id: 0, __v: 0 }).exec()

    },
    deletedQuery: (params) => {
        return PostJob.deleteOne({ postID: new RegExp(params.postID + '$') }).exec()

    },
    deleteBookingQuery: (params) => {
        return Bookings.deleteOne({ postID: new RegExp(params.postID + '$') }).exec()

    },
    getbookingQuery: (params) => {
        var query = {
            $or: [{
                postID: { $regex: '^' + params.postID + '$', $options: 'i' }
            }
            ]
        }
        return Bookings.findOne(query, { _id: 0, __v: 0 }).exec()
    },
    getInboxQuery: (params) => {
        var query = {
            $or: [{
                "notifyInbox.data.postID": { $regex: '^' + params.postID + '$', $options: 'i' }
            }
            ]
        }
        return Inbox.find(query, { _id: 0, __v: 0 }).exec()


    },
    deleteinboxQuery: (params, callback) => {
        return Inbox.deleteOne({ "notifyInbox.data.postID": new RegExp(params.postID + '$') }).exec()

    },
    getBookingsBasedOnBookingIDQuery: (params) => {
        return Bookings.findOne({ bookingID: new RegExp('^' + params.bookingID + '$') }, { _id: 0, __v: 0 }).exec()
    },
    getUpdateQuery: (params) => {
        return Bookings.updateOne({ bookingID: params.bookingID, "bookedTaskers.offeredUserID": params.offeredUserID },
            {
                $set: { "bookedTaskers.$.paymentStatusToProviderByAdmin": true }
            }).exec()
    },

    UpdateQuery: (params, status) => {
        return Customers.updateMany({ userID: params.userID, }, {
            $set: {
                "accountVerificationStatus": status
            }

        }).exec()
    },
    AccountVerificationUpdateQuery: (params, status) => {

        return AccountVerification.updateMany({ userID: params.userID, }, {
            $set: {
                "isVerified": status,
            }

        }).exec()
    },
    AccountVerificationRejectedQuery: (params, status) => {

        return AccountVerification.updateMany({ userID: params.userID, }, {
            $set: {
                "isVerified": status, "reason": params.reason
            }

        }).exec()
    },

    findfilterQuery: (params, dates) => {
        var poster = false;
        var tasker = false;
        if (params.type === 'Tasker') {
            tasker = [true];
            poster = [true, false];
        } else if (params.type === 'Poster') {
            poster = [true];
            tasker = [true, false];
        }
        else {
            poster = [true, false];
            tasker = [false, true];
        }

        var Status;
        if (params.sortBy === 'Verified') {
            Status = ['Verified'];
        } else if (params.sortBy === 'Rejected') {
            Status = ['Rejected'];
        } else if (params.sortBy === 'Unverified') {
            Status = ['Unverified'];
        } else if (params.sortBy === 'Pending') {
            Status = ['Pending'];
        }
        else {
            Status = ['Verified', 'Rejected', 'Unverified', 'Pending']
        }
        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        var query;
        if (dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ register_time: { $gte: frmDate.toString(), $lte: toDate.toString() } },
                    { postTask: { $in: poster } }, { completeTask: { $in: tasker } }, {
                        accountVerificationStatus: { $in: Status }
                    },
                    { verification_status: true }, { isProfileUpdate: true }]
                }
            } else {
                query = {
                    $and: [{ register_time: { $gte: params.fromdate, $lte: params.todate } },
                    { postTask: { $in: poster } }, { completeTask: { $in: tasker } }, {
                        accountVerificationStatus: { $in: Status }
                    },
                    { verification_status: true }, { isProfileUpdate: true }]
                }
            }
        } else {
            query = {
                $and: [{ postTask: { $in: poster } }, { completeTask: { $in: tasker } }, {
                    accountVerificationStatus: { $in: Status }
                }, { verification_status: true }, { isProfileUpdate: true }],

            }
        }
        return Customers.aggregate([
            {
                $match:
                    query
            },
            {
                $project: {
                    "_id": 0,
                    "userID": 1,
                    "profilePic": 1,
                    "lastName": 1,
                    "firstName": 1,
                    "accountVerificationStatus": 1,
                    "register_time": 1
                }
            }, {
                $sort: {
                    register_time: -1
                }
            }
        ]).skip((pageNumber - 1) * nPerPage).limit(nPerPage * 1).exec()
    },

    fetchTaskerQuery: (params, dates) => {
        var postStatus;

        if (params.taskStatus === 'Open') {
            postStatus = ['Open']
        } else if (params.taskStatus === 'Assigned') {
            postStatus = ['Assigned']
        } else if (params.taskStatus === 'Completed') {
            postStatus = ['Completed']

        } else if (params.taskStatus === 'Cancel') {
            postStatus = ['Cancel']
        } else {
            postStatus = ['Open', 'Assigned', 'Completed', 'Cancel']
        }
        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        var query;
        if (dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ postedDate: { $gte: frmDate.toString(), $lte: toDate.toString() } }, {
                        post_Status: { $in: postStatus }
                    }
                    ]
                }
            } else {
                query = {
                    $and: [{ postedDate: { $gte: params.fromdate, $lte: params.todate } }, {
                        post_Status: { $in: postStatus }
                    }
                    ]
                }
            }
        } else {
            query = {
                $and: [{ post_Status: { $in: postStatus } }],

            }
        }
        return PostJob.aggregate([
            {
                $match:
                    query
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
            }, {
                $sort: {
                    postedDate: -1
                }
            }

        ]).skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage).exec()

    },
    deletecommentQuery: (params) => {
        return PostJob.update({ postID: params.postID },
            { $pull: { comments: { author_email: params.author_email } } }).exec()
    },
    updatecommentQuery: (params) => {
        return PostJob.updateMany({ postID: params.postID, "comments.author_email": params.author_email, "comments.comment_date": params.comment_date },
            { $set: { "comments.$.author_comment": params.author_comment } }).exec()
    },
    deletetaskQuery: (params) => {
        return PostJob.update({ postID: params.postID },
            { $pull: { offers: { offeredUserID: params.offeredUserID } } }).exec()
    },

    serachingQuery: (params) => {
        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        return Customers.find({
            $or: [{ firstName: new RegExp("^" + params.userID, 'i') },
            { lastName: new RegExp("^" + params.userID, 'i'),
            $and: [{accountVerificationStatus: { $in: ['Verified', 'Rejected', 'Unverified', 'Pending']} },
            { verification_status: true }, { isProfileUpdate: true }]}]
        },{"_id": 0,
        "userID": 1,
        "profilePic": 1,
        "lastName": 1,
        "firstName": 1,
        "accountVerificationStatus": 1,
        "register_time": 1}).skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0).limit(nPerPage).exec()
    },
    findreferralQuery: (params, dates) => {
        var isTransferStatus;
        if (params.type === 'Paid') {
            isTransferStatus = [true];
        } else if (params.type === 'UnPaid') {
            isTransferStatus = [false];
        } else {
            isTransferStatus = [true, false]
        }
        var pageNumber = parseInt(params.pageNo);
        var nPerPage = parseInt(params.size);
        var query;
        if (dates) {
            if (params.fromdate === params.todate) {
                var frmDate = new Date(new Date(parseInt(params.fromdate)).toLocaleDateString()).getTime();
                var toDate = new Date(new Date(parseInt(params.todate)).toLocaleDateString()).getTime() + 86399900;
                query = {
                    $and: [{ earningTimeStamp: { $gte: frmDate.toString(), $lte: toDate.toString() } }, {
                        isTransferStatus: { $in: isTransferStatus }
                    },
                    ]
                }
            } else {
                query = {
                    $and: [{ earningTimeStamp: { $gte: params.fromdate, $lte: params.todate } }, {
                        isTransferStatus: { $in: isTransferStatus }
                    },
                    ]
                }
            }
        } else {
            query = {
                $and: [{
                    isTransferStatus: { $in: isTransferStatus }
                }
                ]
            }
        }
        return Referral.find(query).skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
            .limit(nPerPage).sort({ earningTimeStamp: -1 }).exec()

    },
    getCustomerDetails: (params) => {
        return Customers.find({
            $and: [
                { register_time: { $lte: params.toDate, $gte: params.fromDate } },
                { postTask: true }
            ]
        }
            , { _id: 0 }).exec();
    },
    FetchreferralQuery: (postID) => {
        var query = {
            $or: [{
                _id:  postID
            }]
        }
        return Referral.findOne(query, { _v: 0 }).exec()
    },
    UpdatereferralQuery: (params,) => {
        return Referral.updateOne({ _id: params.postID, }, {
            $set: {
                "isTransferStatus": true
            }

        }).exec()
    },
    getProviderDetails: (params) => {
        return Customers.find({
            $and: [
                { register_time: { $lte: params.toDate, $gte: params.fromDate } },
                { completeTask: true }
            ]
        }
            , { _id: 0 }).exec();
    },
    getPendingJobPaymentDetails: (params) => {
        if (params.reportStatus === 'Completed') {
            return Bookings.find({
                $and: [
                    { paymentDate: { $lte: params.toDate, $gte: params.fromDate } },
                    { isTaskCompleted: true }
                ]
            }
                , { _id: 0 }).exec();
        } else if (params.reportStatus === 'Pending') {
            return Bookings.find({
                $and: [
                    { paymentDate: { $lte: params.toDate, $gte: params.fromDate } },
                    { isTaskCompleted: false }
                ]
            }
                , { _id: 0 }).exec();
        } else {
            return Bookings.find({
                $and: [
                    { paymentDate: { $lte: params.toDate, $gte: params.fromDate } }
                ]
            }
                , { _id: 0 }).exec();
        }
    },
    getReferralDetails: (params) => {
        return Referral.find(
            { earningTimeStamp: { $lte: params.toDate, $gte: params.fromDate } }
            , { _id: 0 }).exec();
    },
    getDeviceTokens: (params) => {
        return notificationDB.find({ userID: { $in: params.userIDS } }, { _id: 0 }).exec();
    },
    insertNotificationInbox: (dbData) => {
        return notificationInboxDB.insertMany(dbData);
    },
    getPostJobsCount: (startDate, endDate, opt) => {
        if (opt === 'm') {
            return PostJob.aggregate([
                {
                    $project: { "_id": { "$toDate": { "$toLong": "$postedDate" } }, "postTitle": "$category.categoryId" }
                },
                {
                    "$match": { "_id": { $gte: startDate, $lte: endDate } }
                },
                {
                    $group: {
                        _id: { "monthDate": { "$dateToString": { "format": "%d-%m-%Y", "date": "$_id" } } },
                        "postJobArr": { $push: "$postTitle" }
                    }
                },
                { "$sort": { _id: 1 } },
            ])
        }
        if (opt === 'y') {
            return PostJob.aggregate([
                {
                    $project: { "_id": { "$toDate": { "$toLong": "$postedDate" } }, "postTitle": "$category.categoryId" }
                },
                {
                    "$match": { "_id": { $gte: startDate, $lte: endDate } }
                },
                {
                    $group: {
                        _id: { "monthDate": { "$dateToString": { "format": "%m-%Y", "date": "$_id" } } },
                        "postJobArr": { $push: "$postTitle" }
                    }
                },
                { "$sort": { _id: 1 } },
            ])
        }
        if (opt === 'all') {
            return PostJob.aggregate([
                {
                    $project: { "_id": { "$toDate": { "$toLong": "$postedDate" } }, "postTitle": "$category.categoryId" }
                },
                {
                    $group: {
                        _id: { "monthDate": { "$dateToString": { "format": "%m-%Y", "date": "$_id" } } },
                        "postJobArr": { $push: "$postTitle" }
                    }
                },
                { "$sort": { _id: 1 } }
            ])
        }
    },
    getCategoryNames: () => {
        return CategoryDb.find({}, { categoryId: 1, _id: 0 }).sort({ categoryName: 1 }).exec();
    },
    getRangeBookingCount: (startDate, endDate, opt) => {

        if (opt === 'm') {
            return Bookings.aggregate([
                {
                    $project: { "_id": { "$toDate": { "$toLong": "$paymentDate" } } }
                },
                {
                    "$match": { "_id": { $gte: startDate, $lte: endDate } }
                },
                {
                    "$group": {
                        "_id": { "$dateToString": { "format": "%m-%d-%Y", "date": "$_id" } },
                        "count": { "$sum": 1 }
                    }
                }, { $sort: { _id: 1 } }
            ])
        }
        if (opt === 'y') {
            return Bookings.aggregate([
                {
                    $project: { "_id": { "$toDate": { "$toLong": "$paymentDate" } } }
                },
                {
                    "$match": { "_id": { $gte: startDate, $lte: endDate } }
                },
                {
                    "$group": {
                        "_id": { "$dateToString": { "format": "%m-%Y", "date": "$_id" } },
                        "count": { "$sum": 1 }
                    }
                }, { $sort: { _id: 1 } }
            ])
        }
        if (opt === 'all') {
            return Bookings.aggregate([
                {
                    $project: { "_id": { "$toDate": { "$toLong": "$paymentDate" } } }
                },
                {
                    "$group": {
                        "_id": { "$dateToString": { "format": "%m-%Y", "date": "$_id" } },
                        "count": { "$sum": 1 }
                    }
                }, { $sort: { _id: 1 } }
            ])
        }
    },
    getBookingReportDetails: (params) => {
        var sortBy = 'sortBy';
        var fromDate = 'fromDate';
        var toDate = 'toDate';
        var query;
        if (params.hasOwnProperty(sortBy) && params.hasOwnProperty(fromDate) && params.hasOwnProperty(toDate)) {
            if (params.sortBy === 'All') {
                query = {
                    $and: [{ 'paymentDate': { $gte: params.fromDate, $lte: params.toDate } }
                    ]
                }
            } else {
                query = {
                    $and: [{ 'paymentDate': { $gte: params.fromDate, $lte: params.toDate } }, {
                        paymentStatus: { $regex: '^' + params.sortBy + '$', $options: 'i' }
                    },
                    ]
                }
            }
        } else if (params.hasOwnProperty(sortBy) || (params.hasOwnProperty(fromDate) && params.hasOwnProperty(toDate))) {
            if (params.hasOwnProperty(sortBy)) {
                if (params.sortBy === 'All') {
                    console.log("ok Started :");
                    query = {}
                } else {
                    query = {
                        $and: [{
                            paymentStatus: { $regex: '^' + params.sortBy + '$', $options: 'i' }
                        },
                        ]
                    }
                }
            }
            else {
                query = {
                    $and: [{ 'paymentDate': { $gte: params.fromDate, $lte: params.toDate } }
                    ]
                }
            }
        } else {
            query = {}
        }

        return Bookings.find(query, { _id: 0 }).exec()
    },
    insertAdminInboxQuery: (userID) => {
        let userInbox = new AdminNotifyInbox({
            userID: userID
        })
        return userInbox;
    },
    getAdminNotifications: (params) => {
        return AdminNotifyInbox.findOne({ userID: params.userID }).exec();
    },
    fetchCustomersBasedOnFilters: (params) => {
        var poster;
        var tasker;
        if (params.type === 'Tasker') {
            tasker = [true];
            poster = [true, false];
        } else if (params.type === 'Poster') {
            poster = [true];
            tasker = [true, false];
        }
        else {
            poster = [true, false];
            tasker = [false, true];
        }
        var query = {
            $and: [{ postTask: { $in: poster } }, { completeTask: { $in: tasker } },
            { verification_status: true }, { isProfileUpdate: true }]
        }
        return Customers.aggregate([{
            $match: query
        },
        {
            "$group": {
                "userIDs": {
                    "$push": "$userID"
                },
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                userIDs: 1
            }
        }
        ]).exec()
    },
    getNotificationByItsID: (params) => {
        if (params.type === 'Sent') {
            return AdminNotifyInbox.findOne({ userID: params.userID, "sentInbox.notifyID": params.notifyID },
                { _id: 0, "sentInbox.$": 1 }).exec()
        } else {
            return AdminNotifyInbox.findOne({ userID: params.userID, "recievedInbox.notifyID": params.notifyID },
                { _id: 0, "recievedInbox.$": 1 }).exec()
        }
    },
    deleteAdminNotificationByItsIDQuery: (params) => {
        if (params.type === 'Sent') {
            return AdminNotifyInbox.updateOne({ userID: new RegExp(params.userID, 'i'), "sentInbox.notifyID": params.notifyID },
                {
                    $pull: {
                        sentInbox: {
                            notifyID: params.notifyID
                        }
                    }
                }).exec()
        } else {
            return AdminNotifyInbox.updateOne({ userID: new RegExp(params.userID, 'i'), "recievedInbox.notifyID": params.notifyID },
                {
                    $pull: {
                        recievedInbox: {
                            notifyID: params.notifyID
                        }
                    }
                }).exec()
        }

    },
    addingPushNotificationsToAdminSentInboxQuery: (userID, notifyData) => {
        let timeStamp = new Date().getTime().toString();
        var notifyID = "notify_" + new Date().getTime().toString() + GenerateID.makeId();
        //console.log('notify data...', notifyData);
        notifyData.notifyID = notifyID;
        notifyData.timeStamp = timeStamp;
        notifyData.isRead = false;
        //console.log('after adding timestamp object...', notifyData);
        return AdminNotifyInbox.updateOne({ userID: userID },
            { $push: { "sentInbox": notifyData } }
        ).exec();
    },
    addingPushNotificationsToAdminRecieveInboxQuery: (userID, notifyData) => {
        let timeStamp = new Date().getTime().toString();
        var notifyID = "notify_" + new Date().getTime().toString() + GenerateID.makeId();
        //console.log('notify data...', notifyData);
        notifyData.notifyID = notifyID;
        notifyData.timeStamp = timeStamp;
        notifyData.isRead = false;
        //console.log('after adding timestamp object...', notifyData);
        return AdminNotifyInbox.updateOne({ userID: userID },
            { $push: { "recievedInbox": notifyData } }
        ).exec();
    },
    getThisMonthCustomer: (params) => {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        console.log("first Day :" + firstDay);
        var firstEpochDay = firstDay.getTime();
        console.log("first epoch :" + firstEpochDay);
        return Customers.aggregate([
            {
                $match: {
                    $and:[{register_time: {
                        $gte: firstEpochDay.toString()
                    }},{ "verification_status":  true  },{
                        "isProfileUpdate": true
                    }]
                    
                }
            },
            {
                $count: "TotalCount"
            }
        ]).exec()

    },
    getTotalCustomers: (params) => {
        return Customers.aggregate([
            {
                "$facet": {
                    "TotalUsers": [
                        { "$match": {$and:[{ "verification_status":  true  },{
                            "isProfileUpdate": true
                        }]
                         }},
                        { "$count": "TotalUsers" }
                    ],
                    "PendingVerification": [
                        { "$match": { "accountVerificationStatus": { "$exists": true, "$in": ["Pending"] } } },
                        { "$count": "PendingVerification" }
                    ],
                    "RejectedVerification": [
                        { "$match": { "accountVerificationStatus": { "$exists": true, "$in": ["Rejected"] } } },
                        { "$count": "RejectedVerification" }
                    ]
                }
            },
            {
                "$project": {
                    "TotalUsers": { "$arrayElemAt": ["$TotalUsers.TotalUsers", 0] },
                    "PendingVerification": { "$arrayElemAt": ["$PendingVerification.PendingVerification", 0] },
                    "RejectedVerification": { "$arrayElemAt": ["$RejectedVerification.RejectedVerification", 0] }
                }
            }
        ])
    },
    TaskDetailsStatus: (params) => {
        return PostJob.aggregate([
            {
                "$facet": {
                    "TaskInfo": [
                        { $unwind: "$post_Status" },
                        { $sortByCount: "$post_Status" }
                    ]
                }
            }
        ])
    },
    getBookingsPayments: (params) => {
        return Bookings.aggregate([
            { $unwind: '$bookedTaskers' },
            {
                "$facet": {
                    "TotalBookings": [
                        { "$match": { "bookedTaskers": { "$exists": true } } },
                        { "$count": "TotalBookings" },
                    ],
                    "PaymentComplete": [
                        { "$match": { "bookedTaskers.paymentStatusToProviderByAdmin": true } },
                        { "$count": "PaymentComplete" },
                    ],
                    "PaymentPending": [
                        { "$match": { "bookedTaskers.paymentStatusToProviderByAdmin": false } },
                        { "$count": "PaymentPending" },
                    ],
                    "JobsWithdrawal" :[
                        { "$match" : { "bookedTaskers.isWithDraw" : true } },
                        { "$count" : "JobsWithdrawal"}
                    ] 
                }
            },
            {
                "$project": {
                    "TotalBookings": { "$arrayElemAt": ["$TotalBookings.TotalBookings", 0] },
                    "PaymentComplete": { "$arrayElemAt": ["$PaymentComplete.PaymentComplete", 0] },
                    "PaymentPending": { "$arrayElemAt": ["$PaymentPending.PaymentPending", 0] },
                    "JobsWithdrawal": { "$arrayElemAt": ["$JobsWithdrawal.JobsWithdrawal", 0] }
                }
            }
        ]).exec()
    }

}

module.exports = AdminDBQueries;