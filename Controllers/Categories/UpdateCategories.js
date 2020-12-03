const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const Busboy = require('busboy');
const randomFileName = require('../Core/RandomFilename');
var fs = require('fs');
var paramValidator= require('./CategoriesParamValidations');
var dbQueries = require('./CategoriesDBQueries');


var categoriesUpdate = {
    update: (params, file, headers, req, callback) => {
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
            let profile_get_Query = dbQueries.getCategoryQuery(params);
            profile_get_Query.then((user_Found) => {
                console.log('user found',user_Found)
                if (user_Found) {
                    if (file !== null) {
                        let imageName = randomFileName.getFileName(file.name);
                        let imagepath = "./public/images/Category/" + imageName;
                        file.mv(imagepath, (fileErr) => {
                            if (fileErr) {
                                console.log(fileErr);
                                return callback({
                                    status: 200,
                                    data:
                                        {
                                            response: statusCodes.failure,
                                            message: statusMessages.something_went_Wrong
                                        }
                                });
                            } else {
                                updateData(callback, user_Found, fields, imageName)
                            }

                        });
                    } else {
                        updateData(callback, user_Found, fields, "");
                    }
                } else {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "categories_info_notFound"
                        }
                    });
                }
            })
        }
        var busboy = new Busboy({headers: headers});
        // The file upload has completed
        busboy.on('finish', function () {
            if (file != null) {
                uploadToFolder(file.image, params);
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
    }
}

function updateData(callback, user_Found, params, imageName) {
    if (imageName !== "") {
        imageName = "/images/Category/" + imageName
    }
    let updateQuery = dbQueries.categoryUpdateQuery(params, imageName);
    updateQuery.then((isUpdated) => {
        if (isUpdated) {
            console.log('image',user_Found.image);
            fs.unlink('./public' + user_Found.image, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            });
            return callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "categories_info_update_success"
                }
            });
        }
        return callback({
            status: 200,
            data: {
                response: statusCodes.failure,
                message: "categories_info_update_failed"
            }
        });

    })
}

module.exports = categoriesUpdate;