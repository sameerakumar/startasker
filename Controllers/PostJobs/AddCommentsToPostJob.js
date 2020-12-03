const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const Notification = require('../Core/Notifications');

var AddCommentToPost = {

    addComment: (params, callback) => {
        const { error } = paramValidations.validateAddCommentsToPostJobsParams(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return
        }
        let postId = params.postID;
        let fetchQuery = dbQueries.getPostJobQueryFromPostId(postId);
        fetchQuery.then((isFound) => {
            if (isFound) {                
                let addCommentQuery = dbQueries.getPushCommentsToPostJobQuery(params);
                addCommentQuery.then((err) => {
                    console.log('data saved...')
                    if (!err) {
                        callback({
                            response: statusCodes.failure,
                            message: "Adding comment to postjob is failed"
                        });
                        return;
                    } else {
                        if(params.author_email === isFound.userID){
                            
                        }else{
                        var data =   {
                            notification:{
                                "title": "StarTasker",
                                "body": params.author + " commented on your task " + isFound.postTitle,
                                "sound": "default",
                                "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                            },
                            data:{
                                "profilePic": params.author_url,
                                "userID": params.author_email,
                                "postID": params.postID,                   
                                "type": "PostJob"
                            }
                        }
                        Notification.sendNotifications(isFound.userID,data);
                    }
                        callback({
                            response: statusCodes.success,
                            message: "Adding comment to postjob is success"
                        });
                        return;
                    }
                })

            } else {
                callback({
                    response: statusCodes.failure,
                    message: "No job found to add comment"
                });
                return;
            }
        })
    }
}

module.exports = AddCommentToPost;