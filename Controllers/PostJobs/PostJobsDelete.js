const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
var fs = require('fs');

var deletePostJob = {

    deleteJob:(params,callback) => {
        const { error } = paramValidations.validateDeleteJobParams(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return;
        }
        let getJobQuery = dbQueries.getPostJobQueryFromPostId(params.postID);
        getJobQuery.then((found) => {
            if(found){        
                return deletePostJobs(callback, params);
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No job found to cancel"
                    }
                });
                return;
            }
        })
    }


}

function deletePostJobs(callback,params){
    let deleteJobQuery = dbQueries.getDeletePostJobQuery(params.postID);
    deleteJobQuery.then((isDelete) => {
        if(isDelete){           
            // for (let attachment of images){
            //         fs.unlink('./public' + attachment, (err) => {
            //             if (err) {
            //                 console.error(err)
            //                 return
            //             }
            //         });
            //     }
            
            callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Job canceled successfully"
                }
            });
            return;
        }else{
            callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: "Job failed to canceled"
                }
            });
            return;
        }
    })

}

module.exports = deletePostJob;