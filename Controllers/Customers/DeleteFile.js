const statusCodes = require('../Core/StatusCodes');
var paramValidator= require('./CustomerParamsValidation');
var dbQueries = require('./CustomerDBQueries');
var fs = require('fs');
var path = require('path');

var DeleteFile = {

    unlinkFile:(params,callback)=>{
        const { error } = paramValidator.validateDeleteFileParams(params);
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
       
        let query = dbQueries.getUserQueryFromUserId(params.userID);
            query.then((user) => {
            if(user){
                            var filepath = params.path;
                            var fileExtention = path.parse(filepath).ext;
                            if(fileExtention === '.mp4'){
                            var directory = "./public/images/Gallery/";
                            console.log('filepath...',filepath);
                            var fileName = path.basename(filepath);
                            let fileName1 = path.parse(fileName).name;
                            var thumbnail = fileName1 + ".png";
                            var thumbPath = '/images/Gallery/' + thumbnail;
                            console.log('thumb path...',thumbnail);
                            var query = dbQueries.deleteFilePathFromGalleryArrayQuery(params.userID,params.path);
                            query.then((deleted)=>{
                                console.log('deleted path success..',deleted);
                                fs.unlink(path.join(directory, fileName), err => {
                                    if (err) throw err;
                                  });
                                  var query1 = dbQueries.deleteFilePathFromGalleryArrayQuery(params.userID,thumbPath);
                                  query1.then((deleted1)=>{
                                      console.log('deleted path success1..',deleted1);
                                      fs.unlink(path.join(directory, thumbnail), err => {
                                          if (err) throw err;
                                        });
                                  }) 
                            })                                                     
                              callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "File deleted successfully"
                                }
                            });
                            return;
                        }else{
                            var directory = "./public/images/Gallery/";
                            console.log('filepath...',filepath);
                            var fileName = path.basename(filepath);
                            var query = dbQueries.deleteFilePathFromGalleryArrayQuery(params.userID,params.path);
                            query.then((deleted)=>{
                                console.log('deleted path success..',deleted);
                                fs.unlink(path.join(directory, fileName), err => {
                                    if (err) throw err;
                                  });
                            })
                            
                            } 
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: "File deleted successfully"
                                }
                            });
                            return;
            }else{
                return callback({
                    status: 200,
                    data: { response: statusCodes.failure, message: "No user found with this userid" }
                });
            }
        })
    }
}

module.exports = DeleteFile;