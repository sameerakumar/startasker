const statusCodes = require('../Core/StatusCodes');
var paramValidator= require('./CustomerParamsValidation');
var dbQueries = require('./CustomerDBQueries');
const Busboy = require('busboy');
const randomFileName = require('../Core/RandomFilename');
const path = require('path');
const async = require('async');
const thumbler = require('video-thumb');

var FilesUploadToServer = {

   uploadFiles:(params,attachFiles, headers,req,callback) =>{
    const { error } = paramValidator.UpdateProfileParams(params);
    if (error) {
         callback({
            status: 400,
            data: {
                response: statusCodes.failure,
                message: error.details[0].message
            }
        });
        return;
    }
    var busboy = new Busboy({ headers: headers });
        // The file upload has completed
        //console.log(attachFiles);
        busboy.on('finish', function () {
            uploadToFolder(attachFiles, params);
        });
        req.pipe(busboy);
        function uploadToFolder(files, fields) {
            let query = dbQueries.getUserQueryFromUserId(fields.userID);
            query.then((user) => {
                if(user){                
                    console.log(files);
                    if (files !== null) {
                        var imageCount = 0;
                        for (let key in files) {
                            if (files.hasOwnProperty(key)) {
                                var image = files[key];
                                console.log(image);
                                let fileExtention = path.parse(image.name).ext;
                                console.log('file extension...', fileExtention);
                                if(fileExtention === '.mp4'){
                                    let imageName = randomFileName.getFileName(image.name);
                                    let imageURL = "/images/Gallery/" + imageName;
                                    let fileName = path.parse(imageName).name;
                                    console.log('file name..',fileName);
                                    let imagepath = "./public/images/Gallery/" + imageName;
                                    let thumblerPath = "./public/images/Gallery/" + fileName + '.png';
                                    let thumblerURL =   "/images/Gallery/" + fileName + '.png';                             
                                    async.parallel(image.mv(imagepath,(fileErr) => {
                                        if (fileErr) {
                                            return callback({
                                                status: 200,
                                                data: { response: statusCodes.failure, message: "Something went wrong" }
                                            });
                                        } else {
                                            thumbler.extract(imagepath,thumblerPath, '00:00:01', '300x200', function(em,dm){
                                                if(em){
                                                    console.log(em);
                                                }else{
                                                    //console.log(dm);
                                                    console.log('snapshot saved to snapshot.png (200x125) with a frame at 00:00:22');
                                        
                                                }
                                        
                                            });                                           
                                        }
                                    }));                                    
                                    imageCount +=1;
                                    if(imageCount == countObjectKeys(files)){
                                        return callback({
                                            status: 200,
                                            data: {
                                                response: statusCodes.success,
                                                message: "File uploaded successfully",
                                                videoPath: imageURL,
                                                thumblerPath : thumblerURL
                                            }
                                        });
                                    }
                                }
                                else{
                                let imageName = randomFileName.getFileName(image.name);
                                let imageURL = '/images/Gallery/' + imageName;
                                let imagepath = "./public/images/Gallery/" + imageName;
                                image.mv(imagepath, (fileErr) => {
                                    if (fileErr) {
                                        return callback({
                                            status: 200,
                                            data: { response: statusCodes.failure, message: "Something went wrong" }
                                        });
                                    } else {
                                        imageCount +=1;
                                        if(imageCount == countObjectKeys(files)){
                                            return callback({
                                                status: 200,
                                                data: {
                                                    response: statusCodes.success,
                                                    message: "File uploaded successfully",
                                                    imagePath : imageURL
                                                }
                                            });
                                        }
                                    }
                                });
                                }
                            }
                        }
                    }else{
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "Please pass file"
                            }
                        });
                    }
                }else{
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "Noo user found to upload file"
                        }
                    });
                }
        })
    }
   }
}
function countObjectKeys(obj) { 
    return Object.keys(obj).length; 
}

module.exports = FilesUploadToServer;