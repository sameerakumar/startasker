const FeedBack = require('./ShareFeedBack');

var feedback = {
    feedback: (params, callback) => {
        return FeedBack.feedback(params, callback);
    }
};

module.exports = feedback;