const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
var paramValidator= require('./CustomerParamsValidation');
var dbQueries = require('./CustomerDBQueries');
const Busboy = require('busboy');
const path = require('path');
const randomFileName = require('./../Core/RandomFilename');
var customerUpdateProfile = {

    updatedata: (params, profilePic, headers, req, callback) => {
        const { error } = paramValidator.UpdateProfileParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        function uploadToFolder(file, params){
            let getCustomerWithId = dbQueries.getUserQueryFromUserId(params.userID);
            getCustomerWithId.then((isFound) => {
                if(isFound){
                    const imagePath = isFound.profilePic
                    if(imagePath == null){
                        if (file !== null) {
                            //console.log("file is",file);
                            let imageName = randomFileName.getFileName(file.name);
                            let imagepath = "./public/images/Customers/" + imageName;
                            file.mv(imagepath, (fileErr) => {
                                if (fileErr) {
                                    console.log(fileErr);
                                    callback({
                                        status: 200,
                                        data: { response: '0', message: statusMessages.something_went_Wrong }
                                    });
                                } else {
                                    insert(params,fileName,isFound,callback);
                                }
                            });
                        }else{
                            insert(params,"",isFound,callback);
                        }
                    }else{
                        var fileName = path.basename(imagePath);
                        if (file !== null) {
                            console.log("file is",file);
                            //let imageName = randomFileName.getFileName(file.name);
                            let imagepath = "./public/images/Customers/" + fileName;
                            file.mv(imagepath, (fileErr) => {
                                if (fileErr) {
                                    console.log(fileErr);
                                    callback({
                                        status: 200,
                                        data: { response: '0', message: statusMessages.something_went_Wrong }
                                    });
                                } else {
                                    insert(params,fileName,isFound,callback);
                                }
                            });
                        }else{
                            insert(params,"",isFound,callback);
                        }
                    }
                }else{
                    callback({ status: 200, data: { response: statusCodes.failure, message: "Customer not found with this Id" } });
                    return;
                }
            });
        }
        var busboy = new Busboy({ headers: headers });
        // The file upload has completed

        busboy.on('finish', function () {
            if (profilePic !== null) {  // Handling No profile pic also
                console.log(profilePic.profilePic);
                // Grabs your file object from the request.
                const file = profilePic.profilePic;
                // Begins the upload to the AWS S3
                uploadToFolder(file, params);
            } else {
                uploadToFolder(null, params);
            }

        });
        req.pipe(busboy);

    }

}
function insert(params, imageName,user,callback){
    if (imageName !== "") {
        imageName = "/images/Customers/" + imageName
    }
    let updateInfo = dbQueries.customerProfileUpdateQuery(params,imageName);
    updateInfo.then((isUpdate) => {
        if(isUpdate){
            callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Customer info update successfully"
                }
            });
            return;
        }else{
            callback({ status: 200, data: { response: statusCodes.failure, message: "Customer info update failed", customerInfo: user } });
            return;
        }
    });
}

module.exports = customerUpdateProfile;