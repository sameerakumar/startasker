const FeedBack = require('../../app/Models/FeedBack');

var feedbackDBQueries = {

    getFeedBackQuery: (params) => {
        let query = {
            $or: [{
                userID: {$regex: params.userID, $options: 'i'}
            }]
        };
        return FeedBack.findOne(query, {_id: 0, __v: 0}).exec()

    },
    insertQuery:(params,userID) => {
        let sharefeedback = new FeedBack({
            userID:params.userID,
            reviewMessage: params.reviewMessage,
            RatethisApp: params.RatethisApp
        });
        return sharefeedback
    }
}

module.exports = feedbackDBQueries;