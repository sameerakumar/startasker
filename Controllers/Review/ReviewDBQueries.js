const Review = require('../../app/Models/Review');
const Bookings = require('../../app/Models/BookingsData');
const PostJob = require('../../app/Models/PostJob');
var ReviewDBQueries = {

    ratingsToCustomerQuery: (params) => {
        const timestamp = new Date().getTime().toString();       
        let CustomerRatingsSchema = new Review({
            postID: params.postID,
            bookingID: params.bookingID,
            ratingsGivenBy:params.ratingsGivenBy,
            ratingsGivenTo:params.ratingsGivenTo,
            ratingsAsAPoster:params.ratingsAsAPoster,
            body:params.body,
            postTitle: params.postTitle,
            timestamp:timestamp
        });
        return CustomerRatingsSchema;
    },
    ratingsToProviderQuery: (params) => {
        const timestamp = new Date().getTime().toString();       
        let ProviderRatingsSchema = new Review({
            postID: params.postID,
            bookingID: params.bookingID,
            ratingsGivenBy:params.ratingsGivenBy,
            ratingsGivenTo:params.ratingsGivenTo,
            ratingsAsAProvider:params.ratingsAsAProvider,
            body:params.body,
            postTitle: params.postTitle,
            timestamp:timestamp
        });
        return ProviderRatingsSchema;
    },
    getReviewsByUserID:(params)=>{
        return Review.find({ "ratingsGivenTo.userID" : params.userID}).sort({timestamp:-1}).exec()
    },
    fetchReviewsByUserID:(userID)=>{
        return Review.find({ "ratingsGivenTo.userID" : userID}).exec()
    },
    updateProviderRatingsToOffersQuery:(params,ratings)=>{
        return PostJob.updateMany({"offers.offeredUserID": params.ratingsGivenTo.userID},
        {
            $set: {"offers.$.authorRatings" : ratings}
        }).exec()
    },
    updateCustomerRatingsToProvider:(params)=>{
        var offeredUserID = params.ratingsGivenTo.userID;
        return Bookings.updateOne({bookingID: params.bookingID,"bookedTaskers.offeredUserID": offeredUserID},
        {$set : {"bookedTaskers.$.ratingsToProvider" : true}
        }).exec()
    },
    updateProviderRatingsToCustomer:(params)=>{
        var offeredUserID = params.ratingsGivenBy.userID;
        return Bookings.updateOne({bookingID: params.bookingID,"bookedTaskers.offeredUserID": offeredUserID},
        {$set : {"bookedTaskers.$.ratingsToPoster" : true}
        }).exec()
    },
    getProviderCompletedTaskQuery:(userID)=>{
        return Bookings.find({"bookedTaskers.offeredUserID" : userID}).exec()
    },
    // getProviderCompletedTaskCountQuery:(params) =>{
    //     return Bookings.aggregate(
    //         [{
    //             $match: {
    //                 "bookedTasker.offeredUserID": new RegExp('^' + params.userID + '$', "i")
    //             }
    //         },
    //           {
    //             $match: {
    //               "bookedTaskers.isTaskerCompletedTask": {
    //                 $eq: true
    //               }
    //             }
    //           },
    //           {
    //             $count: "providerCompletedTask"
    //           }
    //         ]
    //       ).exec()},
    getPosterCompletedTaskQuery:(userID) =>{
        return Bookings.find({userID : userID}).exec()
    }
}
module.exports = ReviewDBQueries;