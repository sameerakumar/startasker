const RatingsToProvider = require('./RatingsToProviders');
const Fetch = require('./FetchReview');
const RatingsToCustomer = require('./RatingsToCustomer');
var Review = {

    insert: (params, callback) => {
        return RatingsToProvider.review(params, callback);
    },
    fetchReviews: (params,callback) =>{
        return Fetch.fetchByUser(params,callback);
    },
    ratingToCustomer:(params,callback)=>{
        return RatingsToCustomer.toCustomer(params,callback);
    }
}
module.exports = Review;