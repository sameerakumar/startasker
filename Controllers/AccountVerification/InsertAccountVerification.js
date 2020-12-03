const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./AccountVerificationParamValidations');
const dbQueries = require('./AccountVerificationDBQueries');
const Busboy = require('busboy');
const  path = require('path');

var AccountVerification = {
    file: (params, file, headers, req, callback) => {
        const {error} = paramValidator.validateinsertParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        var busboy = new Busboy({headers: headers});
        // The file upload has completed
        busboy.on('finish', function () {
            if (file != null) {
                //let filedata=(file.IDPhoto,file.profilePhoto);
                console.log("data",file);
                uploadToFolder(file.IDPhoto,file.profilePhoto, params);
            } else {
                return callback({
                    status: 400,
                    data: {
                        response: statusCodes.failure,
                        message: "File not attached"
                    }
                });
            }
        });
        req.pipe(busboy);
        function uploadToFolder(file,file2, fields) {
            let query = dbQueries.getDataQuery(params);
            console.log(file);
            query.then((user) => {
                if (user) {
                    //console.log(file);
                    const IDPath = user.IDPhoto;
                    const photoPath = user.profilePhoto;
                    if(IDPath == "" && photoPath == ""){                    
                    let fileName = randomFileName.getFileName1() + '.png';
                    let filePath = "./public/images/AccountIDProofs/" + fileName;
                    let IDProofPath = '/images/AccountIDProofs/' + fileName;
                    console.log("filepath2",filePath);
                    file.mv(filePath, (fileErr) => {
                        if (fileErr) {
                            return callback({
                                status: 200,
                                data: {response: statusCodes.failure, message: "Something went wrong"}
                            });
                        }
                        else {

                            let fileName2 = randomFileName.getFileName1() + '.png';
                            let filePath2 = "./public/images/ScannedPhotos/" + fileName2;
                            let ScannedPhotoPath = '/images/ScannedPhotos/' + fileName2;
                            file2.mv(filePath2, (fileErr) => {
                                if (fileErr) {
                                    return callback({
                                        status: 200,
                                        data: {response: statusCodes.failure, message: "Something went wrong"}
                                    });

                                } else {
                                    // return insertData(callback, params, filePath,filePath2);
                                }
                            });

                            return updateAccountVerificationData(callback, params,IDProofPath,ScannedPhotoPath);
                        }
                    });


                }else{
                    console.log(file);
                    //const imagePath = user.IDPhoto;
                    var fileName = path.basename(IDPath);
                    let filePath = "./public/images/AccountIDProofs/" + fileName;
                    let IDProofPath = '/images/AccountIDProofs/' + fileName;
                    console.log("filepath2",filePath);
                    file.mv(filePath, (fileErr) => {
                        if (fileErr) {
                            return callback({
                                status: 200,
                                data: {response: statusCodes.failure, message: "Something went wrong"}
                            });
                        }
                        else {
                            //const imagePath = user.profilePhoto;
                            var fileName2 = path.basename(photoPath);
                            let filePath2 = "./public/images/ScannedPhotos/" + fileName2;
                            let ScannedPhotoPath = '/images/ScannedPhotos/' + fileName2;
                            file2.mv(filePath2, (fileErr) => {
                                if (fileErr) {
                                    return callback({
                                        status: 200,
                                        data: {response: statusCodes.failure, message: "Something went wrong"}
                                    });

                                } else {
                                    // return insertData(callback, params, filePath,filePath2);
                                }
                            });

                            return updateAccountVerificationData(callback, params,IDProofPath,ScannedPhotoPath);
                        }
                    });
                }
            }
            });
        }
    }
}

function insertData(callback, params, filePath,filePath2) {
    //console.log("Insert", params);
    let insertQuery = dbQueries.InsertQuery(params,filePath,filePath2);
    insertQuery.save((err) => {
        if (err) {
            return callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: " Account verification data update has been failed"
                }
            });
        } else {
            let statusUpdateQuery = dbQueries.updatePaymentIDStatusQuery(params);
            statusUpdateQuery.then((success)=>{
                console.log('updated...',success);
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Account verification data update has been Success",
                        IDPhoto:filePath,
                        profilePic:filePath2
                    }
                });
            }) 
        }
    })
}
function updateAccountVerificationData(callback, params, filePath,filePath2) {
    //console.log("Insert", params);
    let insertQuery = dbQueries.UpdateQuery(params,filePath,filePath2);
    insertQuery.then((success) => {
        if (!success) {            
            return callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: " Account verification data update has been failed"
                }
            });
        } else {
            let statusUpdateQuery = dbQueries.updatePaymentIDStatusQuery(params);
            statusUpdateQuery.then((success)=>{
                console.log('updated...',success);
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Account verification data update has been Success",
                        IDPhoto:filePath,
                        profilePic:filePath2
                    }
                });
            })            
        }
    })

}

module.exports = AccountVerification;