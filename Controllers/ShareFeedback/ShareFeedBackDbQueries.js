const ShareFeedBack = require('../../app/Models/ShareFeedBack');
const Customers = require('../../app/Models/Customers');

var ShareFeedBackDBQueries = {
    insertQuery: (params) => {
        const timestamp = new Date().getTime().toString();
        let Feedback = new ShareFeedBack({
            userID: params.userID,
            ratings:params.ratings,           
            ratingOptions:params.ratingOptions,
            body:params.body,
            timestamp:timestamp
        });
        return Feedback;
    },
    FetchQuery:(params)=>{
    return ShareFeedBack.find({ "ratingsGivenTo.userID" : params.userID}).exec()
},
     updateCustomerFeedBackStatusQuery:(params)=>{
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') }, {
            $set: {
                isGivenAppRatings: true
            }
        }).exec()
     },
     getCustomerQuery:(params) => {
        var query = { 
            $or: [{ 
                    userID: { $regex: params.userID, $options: 'i' } 
                    }] 
                    }
        return Customers.findOne(query, {_id: 0, __v: 0}).exec()
    
    }
}
module.exports = ShareFeedBackDBQueries;