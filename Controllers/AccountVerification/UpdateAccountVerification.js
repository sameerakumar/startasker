
const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const Busboy = require('busboy');
const randomFileName = require('../Core/RandomFilename');
var fs = require('fs');
var paramValidator= require('./AccountVerificationParamValidations');
var dbQueries = require('./AccountVerificationDBQueries');


var ProfileInfoUpdate = {
    updatefile: (params, profilepic, headers, req, callback) => {
        console.log(params);
        const { error } = paramValidator.validateUpdateParams(params);
        if (error) {
            callback({
                status: 400,
                data: { response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
            return
        }
        function uploadToFolder(file, fields) {
            let get_Query = dbQueries.getDataQuery(params);
            get_Query.then((user) => {
                if (user) {
                    console.log(file);
                    let fileName = randomFileName.getFileName(file.name);
                    let filePath = "./public/images/AccountProfilePic/" + fileName;
                    console.log("filepath2",filePath);

                    file.mv(filePath, (fileErr) => {
                        if (fileErr) {
                            return callback({
                                status: 200,
                                data: {response: statusCodes.failure, message: "Something went wrong"}
                            });
                        }
                        else {
                            return updateData(callback, params,filePath);
                        }
                    });


                }
                else {
                    return callback({
                        status: 200,
                        data: {response: statusCodes.failure, message: "No data found "}
                    });
                }

            });
        }
        var busboy = new Busboy({ headers: headers });
        // The file upload has completed
        busboy.on('finish', function () {
            if (profilepic !== null) {  // Handling No profile pic also
                console.log(profilepic.profilePhoto);
                // Grabs your file object from the request.
                const file = profilepic.profilePhoto;
                // Begins the upload to the AWS S3
                uploadToFolder(file, params);
            } else {
                uploadToFolder(null, params);
            }

        });
        req.pipe(busboy);

    }
}

function updateData(callback, params, filePath) {
    // if (filePath !== "") {
    //     filePath = "/images/AccountProfilePic/" + filePath
    // }
    let updateQuery = dbQueries.UpdateQuery(params, filePath);
    updateQuery.then((isUpdated) => {
        if (isUpdated) {
            fs.unlink('./public' +filePath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            return callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "profile_info_update_success"
                }
            });
        }
        return callback({
            status: 200,
            data: {
                response: statusCodes.failure,
                message: "profile_info_update_failed"
            }
        });

    })
}

module.exports = ProfileInfoUpdate;