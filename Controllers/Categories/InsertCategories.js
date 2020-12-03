const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const GenerateID = require('../Core/IDGenerate');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CategoriesParamValidations');
const dbQueries = require('./CategoriesDBQueries');
const Busboy = require('busboy');
const  fs = require('fs');

var CategoriesInsert = {
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

        function uploadToFolder(file, fields) {
            let query = dbQueries.getCategoryQuery(params);
            query.then((user) => {
                if (!user) {
                    console.log(file);
                    let fileName = randomFileName.getFileName(file.name);
                    let filePath = "./public/images/Category/" + fileName;
                    file.mv(filePath, (fileErr) => {
                        if (fileErr) {
                            return callback({
                                status: 200,
                                data: {response: statusCodes.failure, message: "Something went wrong"}
                            });
                        } else {
                            return insertData(callback, fields, fileName);
                        }
                    });
                }
                else {
                    return callback({
                        status: 200,
                        data: {response: statusCodes.failure, message: "No user found with this categoryid"}
                    });
                }

            });
        }
    }
}

//let categoryid = categoryId();
function insertData(callback, params, filePath) {
    console.log("Insert", params);
    filePath = "/images/Category/" + filePath;
   let categoryid = 'Cat'+GenerateID.makeId();
    let insertJobQuery = dbQueries.categoryInsertQuery(params,categoryid,filePath);
    insertJobQuery.save((err) => {
        if (err) {
            return callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: " Categories insert has been failed"
                }
            });
        } else {
            return callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Categories insert has been Success",
                    categoryId:categoryid
                }

            });

        }
    })

}

module.exports = CategoriesInsert;