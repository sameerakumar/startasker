const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename')
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const Busboy = require('busboy');

var postJobsUpdate = {

    updateJob: (params, attachFiles, headers, req, callback) =>{
        const { error } = paramValidations.validatePostJobsUpdateParams(params);
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
        var busboy = new Busboy({ headers: headers });
        // The file upload has completed
        console.log(attachFiles);
        busboy.on('finish', function () {
            uploadToFolder(attachFiles, params);
        });
        req.pipe(busboy);       
        function uploadToFolder(images, fields) {
            let query = dbQueries.getPostJobQueryFromPostId(fields.postID);
            query.then((user) => {
                // var bookedTaskersCount = user.jobSelectedCount;
                if(fields.numberOfWorkers < user.jobSelectedCount){               
                    return callback({
                        status: 200,
                        data: { response: statusCodes.failure, message: "You do not have option to reduce after hired maximum number of providers" }
                    });
                
                }else{
                if (user) {    
                    var imagesPath = [];
                    // console.log('db images..',user[0].images);
                    // console.log(images);
                    if (images !== null) {
                        var imageCount = 0;
                        for (let key in images) {
                            if (images.hasOwnProperty(key)) {
                                var image = images[key];
                                console.log(image);
                                let imageName = randomFileName.getFileName(image.name);
                                let imagepath = "./public/images/PostImages/" + imageName;
                                image.mv(imagepath, (fileErr) => {
                                    if (fileErr) {
                                        return callback({
                                            status: 200,
                                            data: { response: statusCodes.failure, message: "Something went wrong" }
                                        });
                                    } else {
                                        imagesPath.push(imageName);
                                        imageCount +=1;
                                        if(imageCount == countObjectKeys(images)){
                                            return updatePostJobData(callback, fields, imagesPath);
                                        }
                                    }
                                });

                            }
                        }
                    }else{                      
                            return updatePostJobData(callback, fields, imagesPath);
                        
                    }
                }
                else {
                    return callback({
                        status: 200,
                        data: { response: statusCodes.failure, message: "No post found with this postId" }
                    });
                }   
            }         

            });
        }
    },
    updateJobAsFilled: (params,callback) => {
        const { error } = paramValidations.validateUpdateJobAsFilledParams(params);
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
        let query = dbQueries.getPostJobQueryFromPostId(params.postID);
        query.then((record_found) => {
                if(record_found){
                    let updateQuery = dbQueries.getUpdatePostJobAsFilledQuery(params);
                    updateQuery.then((update) =>{
                        if(update.ok == 1){
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "Job update successfully"
                                   
                                }
                            });
                            return;
                        }
                        callback({
                            status: 200,
                            data: {
                                 response: statusCodes.failure,
                                message: "Job updated failed"
                            }
                        });
                        return;
                        
                    })
                }else{
                    callback({
                        status: 200,
                        data: {
                             response: statusCodes.failure,
                            message: "No data found with this post"
                        }
                    });
                    return;
                }
        });
    }

}
 

function countObjectKeys(obj) { 
    return Object.keys(obj).length; 
}
function updatePostJobData(callback, params, imagesPaths) {
    console.log('imagespaths..',imagesPaths);
    for (var i = 0; i < imagesPaths.length; i++) {
        var imagePath = imagesPaths[i];
        imagePath = "/images/PostImages/" + imagePath

        imagesPaths[i] = imagePath;
    }

    let updatePostJobQuery = dbQueries.updatePostJobsQueryParams(params,imagesPaths);
    updatePostJobQuery.then((isSuccess) => {
        if (isSuccess) {
            callback({
                status: 200,
                data: {
					response: statusCodes.success,
                    message: "Job update successfully"
                   
                }
            });
            return;
        } else {
            callback({
                status: 200,
                data: {
                     response: statusCodes.failure,
                    message: "Job update failed"
                }
            });
            return;
        }
    })
}

module.exports = postJobsUpdate;