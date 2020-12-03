var InsertPostJobs = require('../PostJobs/InsertPostJobs');
var FetchPostJobs = require('../PostJobs/PostJobsFetching');
var UpdatePostJobs = require('../PostJobs/PostJobsUpdate');
var BrowsePostJobs = require('../PostJobs/BrowsePostJobs');
var DeletePostJob = require('../PostJobs/PostJobsDelete');
var AddJobToFavorite = require('../PostJobs/AddPostJobToFavourites');
var AddingComment = require('../PostJobs/AddCommentsToPostJob');
var AddOffers = require('../PostJobs/OffersInsert');
var OfferUpdate = require('../PostJobs/OffersUpdate');
var OfferCanceled = require('./OfferCancel');

var PostJobs = {

    postjobs: (params,attachFiles,headers,req,callback) => {
        return InsertPostJobs.insertNewJob(params,attachFiles, headers, req,callback);
    },

    get: (params,callback) => {
        return FetchPostJobs.fetch(params,callback);
    },
    fetchAllJobs: (params,callback) => {
        return FetchPostJobs.fetchAllJobs(params,callback);
    },

    update: (params,attachFiles,headers,req,callback) => {
        return UpdatePostJobs.updateJob(params,attachFiles,headers,req,callback);
    },

    browseJobs: (params,callback) => {
        return BrowsePostJobs.browseJob(params,callback);
    },

    deleteJob: (params,callback) => {
        return DeletePostJob.deleteJob(params,callback);
    },

    addJobToFavourite: (params,callback) => {
        return AddJobToFavorite.addToFavourite(params,callback);
    },
    addCommentToPost: (params,callback) => {
        return AddingComment.addComment(params,callback);
    },
    updatePostJobAsFilled: (params,callback) => {
        return UpdatePostJobs.updateJobAsFilled(params,callback);
    },
    addOffersToPost: (params,callback) =>{
        return AddOffers.addOffer(params, callback);
    },
    replayToOfferMessage: (params, callback) =>{
        return AddOffers.replayToOfferMessage(params, callback);
    },
    offerUpdate:(params,callback)=>{
        return OfferUpdate.updateOffers(params,callback);
    },
    offerCancel:(params,callback)=>{
        return OfferCanceled.OfferCancel(params,callback);
    },
    getOfferedPosts:(params,callback)=>{
        return FetchPostJobs.fetchOfferedPosts(params,callback);
    }
}

module.exports = PostJobs;