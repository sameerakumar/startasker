const ShareFeedBack = require('./InsertShareFeedBack');

var ShareFeedBackController = {
    shareFeedBack:(params,callback)=>{
        return ShareFeedBack.shareFeedback(params,callback);
    }

}

module.exports = ShareFeedBackController;