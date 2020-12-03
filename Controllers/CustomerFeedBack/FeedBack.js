const FeedBack = require('./InsertFeedBack');
const FetchFeedBack = require('./FetchFeedBack');
const Invoice = require('./Invoice');
const DeleteFeedBack = require('./DeleteFeedback');





var feedback = {
    feedback: (params, callback) => {
        return FeedBack.feedback(params, callback);
    },
    fetch: (params,callback) => {
        return FetchFeedBack.fetchdata(params,callback);
    },
    insert: (params, callback) => {
        return Invoice.invoiceData(params, callback);
    },
    delete: (params, callback) => {
        return DeleteFeedBack.delete(params, callback);
    }

};

module.exports = feedback;