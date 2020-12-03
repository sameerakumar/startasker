const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./DealParamValidations');
const dbQueries = require('./DealDBQueries');
const Busboy = require('busboy');
const  fs = require('fs');
const GenerateID = require('../Core/IDGenerate');

var DealsList = {
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
                uploadToFolder(file.offerimage, params);
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
            let query = dbQueries.getDealQuery(params);
            console.log("file",file);
            query.then((user) => {
                if (user) {

                    let fileName = randomFileName.getFileName(file.name);
                    let filePath = "./public/images/Deal/" + fileName;
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
                        data: {response: statusCodes.failure, message: "No user found with this offerid"}
                    });
                }

            });
        }
    }
}

//let categoryid = categoryId();
function insertData(callback, params, filePath) {
    console.log("Insert", params);
    filePath = "/images/Deal/" + filePath;
    let offerid = GenerateID.makeId();
    let insertJobQuery = dbQueries.dealInsertQuery(params,offerid,filePath);
    insertJobQuery.save((err) => {
        console.log('err',err);
        if (err) {
            return callback({
                status: 200,
                data: {
                    response: statusCodes.failure,
                    message: " Deals insert has been failed"
                }
            });
        } else {
            return callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Deals insert has been Success",
                    offerID:offerid
                }

            });

        }
    })

}

module.exports = DealsList;