const FeedBack = require('../../app/Models/CustomerFeedBack');

var feedbackDBQueries = {

    getFeedBackQuery: (params) => {
        let query = {
            $or: [{
                customerID: {$regex: params.customerID, $options: 'i'}
            }]
        };
        return FeedBack.findOne(query, {_id: 0, __v: 0}).exec()

    },
    insertQuery:(params,bookingID) => {
        const timestamp = new Date().getTime().toString();
        let feedback = new FeedBack({
            bookingID:bookingID,
            customerID: params.customerID,
            rating: params.rating,
            taskerID: params.taskerID,
            comment: params.comment,
            timestamp:timestamp
        });
        return feedback
    },
    FetchQuery: () => {
        return FeedBack.find({}, {_id: 0, __v: 0}).exec()
    },
    InsertQuery:(params,customerID) => {
        const register_timestamp = new Date().getTime().toString();
        let invoice = new FeedBack({
            customerID: params.customerID,
            timestamp:register_timestamp
        });
        return invoice;
    },
    deleteQuery:(customerID)=>{
        return FeedBack.deleteOne({ customerID: new RegExp('^' +customerID + '$') }).exec()

    },
}

module.exports = feedbackDBQueries;