const Bookings = require('../../app/Models/BookingsData');
const PostJobs = require('../../app/Models/PostJob');
const Customer = require('../../app/Models/Customers');
const referralEarningDB = require('../../app/Models/ReferAndEarn');

var BookingDBQueries = {

    getUserPostIDQueryFromPostID: (postID) => {
        return PostJobs.findOne({ postID: new RegExp('^' + postID + '$', "i") }).exec()
    },
    insertNewPartialBookingQuery: (params) => {
        let bookings = new Bookings({
            paymentID: params.paymentID,
            bookingID: params.bookingID,
            postID: params.postID,
            serviceCategory: params.serviceCategory,
            taskTitle: params.taskTitle,
            customerName: params.customerName,
            customerProfilePic: params.customerProfilePic,
            userID: params.userID,
            bookedTaskers: params.bookedTaskers,
            taskTotalBudget: params.taskTotalBudget,
            paymentStatus: params.paymentStatus,
            location: params.location,
            convenientTimings: params.convenientTimings,
            loc: params.loc,
            taskDate: params.taskDate,
            attachments: params.attachments,
            mustHaves: params.mustHaves,
            describeTaskInDetails: params.describeTaskInDetails,
            couponCode: params.couponCode,
            couponAmount: params.couponAmount,
            couponDiscount: params.couponDiscount
        });
        return bookings;
    },
    updateBookingQuery: (params) => {
        let paymentdate = new Date().getTime().toString();
        return Bookings.updateOne({ bookingID: params.bookingID },
            {
                $set: {
                    paymentID: params.paymentData.PaymentID,                   
                    paymentDate: paymentdate,
                    paymentStatus: "Completed",
                    paymentData: params.paymentData                                       
                }
            }

        ).exec();
    },
    newBookingInsertQuery:(params) => {
        let paymentdate = new Date().getTime().toString();
        let bookings = new Bookings({
            bookingID: params.bookingID,
            postID: params.postID,
            serviceCategory: params.serviceCategory,
            taskTitle: params.taskTitle,
            customerName: params.customerName,
            customerProfilePic: params.customerProfilePic,
            userID: params.userID,
            bookedTaskers: params.bookedTaskers,
            taskTotalBudget: params.taskTotalBudget,
            paymentDate: paymentdate,
            paymentStatus: params.paymentStatus,
            paymentData: params.paymentData,
            location: params.location,
            convenientTimings: params.convenientTimings,
            loc: params.loc,
            taskDate: params.taskDate,
            attachments: params.attachments,
            mustHaves: params.mustHaves,
            describeTaskInDetails: params.describeTaskInDetails,
			couponCode: params.couponCode,
            couponAmount: params.couponAmount,
            couponDiscount: params.couponDiscount
        });
        return bookings;
    },
    getBookingsByUserIDQuery: (params) => {
        var query = {
            $or: [{
                userID: { $regex: params.userID, $options: 'i' }}, {
                'bookedTaskers.offeredUserID': { $regex: params.userID, $options: 'i' }}]
        }
        return Bookings.find(query, { _id: 0, __v: 0 }).exec()
    },
    getBookingsBasedOnBookingIDQuery: (params) => {
        return Bookings.findOne({ bookingID: new RegExp('^' + params.bookingID + '$') }, { _id: 0, __v: 0 }).exec()
    },
    getPostJobStatusUpdateQuery: (postID) => {
        return PostJobs.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                post_Status: 'Assigned',
            }
        }).exec()
    },
    updatePostJobStatusAsOpenQuery: (postID) => {
        return PostJobs.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                post_Status: 'Open',
            }
        }).exec()
    },
    withDrawJobByCustomerQuery: (params) => {
        return Bookings.updateOne({ bookingID: params.bookingID, "bookedTaskers.offeredUserID": params.offeredUserID },
            {
                $set: { "bookedTaskers.$.isWithDrawCustomer": params.isWithDraw }
            }).exec()
    },
    withDrawJobByProviderQuery: (params) => {
        return Bookings.updateOne({ bookingID: params.bookingID, "bookedTaskers.offeredUserID": params.offeredUserID },
            {
                $set: { "bookedTaskers.$.isWithDraw": params.isWithDraw }
            }).exec()
    },
    updateJobSelectedCountQuery: (count, postID) => {
        return PostJobs.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                jobSelectedCount: count
            }
        }).exec()
    },
    updateJobAppliedCountCountQuery: (count, postID) => {
        return PostJobs.updateOne({ postID: new RegExp(postID, 'i') }, {
            $set: {
                jobAppliedCount: count
            }
        }).exec()
    },
    updateWithDrawStatusInOffersQuery: (params, postID) => {
        return PostJobs.updateOne({ postID: postID, "offers.offeredUserID": params.offeredUserID },
            {
                $set: { "offers.$.isTaskerWithDraw": params.isWithDraw }
            }).exec()
    },
    updateJobCompletedStatus: (params, offeredUserID) => {
        return Bookings.updateOne({ bookingID: params.bookingID, "bookedTaskers.offeredUserID": offeredUserID },
            {
                $set: { "bookedTaskers.$.isCustomerCompletedTask": params.isTaskerCompletedTask }
            }).exec()
    },
    updateJobCompletedStatusByProvider: (params, offeredUserID) => {
        return Bookings.updateOne({ bookingID: params.bookingID, "bookedTaskers.offeredUserID": offeredUserID },
            {
                $set: { "bookedTaskers.$.isTaskerCompletedTask": params.isTaskerCompletedTask }
            }).exec()
    },
    updateCustomerTaskCompleted: (params) => {
        return Bookings.updateOne({ bookingID: params.bookingID },
            {
                $set: {
                    isTaskCompleted: true
                }
            }).exec()
    },
    updateProviderHiredStatusInPostJob: (params, offeredUserID) => {
        return PostJobs.updateOne({ postID: params.postID, "offers.offeredUserID": offeredUserID },
            {
                $set: { "offers.$.isTaskerHired": true }
            }).exec()
    },
    updateProviderUnHiredStatusInPostJob: (postID, offeredUserID) => {
        return PostJobs.updateOne({ postID: postID, "offers.offeredUserID": offeredUserID },
            {
                $set: { "offers.$.isTaskerHired": false }
            }).exec()
    },
    updateProviderWithDrawStatusInPostJob: (params, offeredUserID) => {
        return PostJobs.updateOne({ postID: params.postID, "offers.offeredUserID": offeredUserID },
            {
                $set: { "offers.$.isTaskerWithDraw": true }
            }).exec()
    },
    getCustomerInfoBasedOnID: (userID) => {
        return Customer.findOne({ userID: userID }).exec()
    },
    customerCouponUpdateQuery: (params) => {
        return Customer.updateOne({ userID: params.userID, "coupons.couponCode": params.couponCode },
            {
                $set: { "coupons.$.applied": true }
            }).exec()
    },
    pullProviderOfferFromOffersArrayQuery: (postID, userID) => {
        return PostJobs.updateOne({ postID: postID },
            {
                $pull: { offers: { offeredUserID: userID } }
            }).exec()
    },
    referralEarningInsert: (objEarn) => {
        let timeStamp = new Date().getTime().toString();
        let referralEarnings = new referralEarningDB({
            referralCode: objEarn.referralCode,
            referByUserID: objEarn.referByUserID,
            referToUserID: objEarn.referToUserID,
            postID: objEarn.postID,
            bookingID: objEarn.bookingID,
            taskTitle: objEarn.taskTitle,
            isTaskar: objEarn.isTaskar,
            bookingAmount: objEarn.bookingAmount,
            earningDate: objEarn.earningDate,
            earningTimeStamp: timeStamp,
            earnAmount: objEarn.earnAmount
        });
        return referralEarnings;
    },
    getUpdateQueryForUserFirstTaskDone(userID) {
        return Customer.updateOne({ userID: userID },
            {
                $set: { isFirstTaskDone: true }
            }).exec()
    },
    fetchAllBookingsQuery: () => {
        return Bookings.find({paymentStatus: 'Pending'}, { _id: 0, __v: 0 }).exec()
    },
    deletePartialBookingParams(params) {
        return Bookings.deleteOne({ bookingID: params.bookingID }).exec();
    }
}

module.exports = BookingDBQueries;