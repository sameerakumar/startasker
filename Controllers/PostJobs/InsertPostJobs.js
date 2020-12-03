const statusCodes = require('../Core/StatusCodes');
const GenerateID = require('../Core/IDGenerate');
const randomFileName = require('../Core/RandomFilename')
const statusMessages = require('../Core/StatusMessages');
const paramValidations = require('../PostJobs/PostJobsParameterValidations');
const dbQueries = require('../PostJobs/PostJobsDBQueries');
const Busboy = require('busboy');
const Notifications = require('../Core/PostJobNotifications');
var PostJobs = {
    insertNewJob: (params, attachFiles, headers, req, callback) => {
        const { error } = paramValidations.validateNewPostJobParamS(params);
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
            let query = dbQueries.getUserQueryFromUserId(fields.userID);
            query.then((user) => {
                if (user) {
                    let postID = 'POST' + GenerateID.makeId();                   
                    var imagesPath = [];
                    //console.log(images);
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
                                            return insertPostJobData(callback, fields, postID, imagesPath,user.profilePic);
                                        }
                                    }
                                });

                            }
                        }
                    }else{
                    return insertPostJobData(callback, fields, postID, imagesPath,user.profilePic);
                    }
                }
                else {
                    return callback({
                        status: 200,
                        data: { response: statusCodes.failure, message: "No user found with this userid" }
                    });
                }

            });
        }
    }
}

function countObjectKeys(obj) { 
    return Object.keys(obj).length; 
}
function insertPostJobData(callback, params, postID, imagesPaths,profilePic) {
    console.log('imagespaths..',imagesPaths);
    for (var i = 0; i < imagesPaths.length; i++) {
        var imagePath = imagesPaths[i];
        imagePath = "/images/PostImages/" + imagePath
        imagesPaths[i] = imagePath;
    }
    let insertJobQuery = dbQueries.newPostJobsInserQuery(params, postID, imagesPaths);
    insertJobQuery.save((err) => {
        if (!err) {
           // console.log(err);
            callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: "Job posted failed"
                }
            });
            return;
        }else{
             return getNearByLocationUsersToSendNotification(params,postID,profilePic,callback);
        } 
                   
    })
}

function getNearByLocationUsersToSendNotification(params,postID,profilePic,callback){
    let getQuery = dbQueries.getNearByLocationUsersQuery(params);
    getQuery.then((found)=>{
        console.log('matched location users...',found);
        if(found.length === 0){
            callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Job posted successfully",
                    postID: postID
                }
            });
            return;  
        }else{
            if(params.post_Status != 'Draft'){            
            for(var i=0;i<found.length;i++)
            {
                var matchedUserID = found[i].userID;
                var data =   {
                    notification:{
                        "title": params.postTitle + " with category "+ params.category.categoryName ,
                        "body": params.describeTaskInDetails,                    
                        "sound": "default",
                        "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                        "click_action": "https://www.startasker.com/#/browsejobs/job/" + params.postID
                    },                  
                    data: {
                    "profilePic": profilePic,
                    "userID": params.userID,
                    "postID": postID,
                    "type":"PostJob"
                    }
                }
                Notifications.sendPostJobNotifications(matchedUserID, data,params.category.categoryName,params.longitude,params.latitude,params.postTitle);
            }
        }
            callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Job posted successfully",
                    postID: postID
                }
            });
            return;           
        }
    })
}

module.exports = PostJobs;