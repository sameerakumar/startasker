const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
var paramValidator = require('./CustomerParamsValidation');
var dbQueries = require('./CustomerDBQueries');
const Busboy = require('busboy');
const randomFileName = require('../Core/RandomFilename');
const cc = require('coupon-code');
var customerInfoUpdate = {

    update: (params, profilepic, headers, req, callback) => {
        const { error } = paramValidator.validateUpdateParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        function uploadToFolder(file, params) {
            let getCustomerWithId = dbQueries.getUserQueryFromUserId(params.userID);
            getCustomerWithId.then((isFound) => {
                if (isFound) {
                    if (file !== null) {
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
                                insert(params, imageName, isFound, callback);
                            }
                        });
                    } else {
                        insert(params, "", isFound, callback);
                    }
                } else {
                    callback({ status: 200, data: { response: statusCodes.failure, message: "Customer not found with this Id" } });
                    return;
                }
            });
        }
        var busboy = new Busboy({ headers: headers });
        // The file upload has completed

        busboy.on('finish', function () {
            if (profilepic !== null) {  // Handling No profile pic also 
                console.log(profilepic.profilePic);
                // Grabs your file object from the request.
                const file = profilepic.profilePic;
                // Begins the upload to the AWS S3
                uploadToFolder(file, params);
            } else {
                uploadToFolder(null, params);
            }

        });
        req.pipe(busboy);

    }

}
function insert(params, imageName, user, callback) {
    if (imageName !== "") {
        imageName = "/images/Customers/" + imageName
    }
    let updateInfo = dbQueries.customerInfoUpdateQuery(params, imageName);
    updateInfo.then((isUpdate) => {
        if (isUpdate) {
            let insertQuery = dbQueries.insertCustomerQuery(params.userID);
            insertQuery.save((success) => {
                console.log('suceess', success);
            })
            let insertInboxQuery = dbQueries.insertUserInboxQuery(params.userID);
            insertInboxQuery.save((success) => {
                console.log('success', success);
            })
            let insertAccountQuery = dbQueries.insertUserAccountVerification(params.userID);
            insertAccountQuery.save((success)=>{
                console.log('success', success);
            })
            // let insertCouponQuery = dbQueries.insertNewUserToCouponsQuery(params);
            // insertCouponQuery.save((success)=>{
            //     console.log('success', success);
            // })
             for(var i=0;i<5;i++){
                var code = cc.generate({parts: 1})
                var couponCode = 'STH-' + code + '005';
                var insertCoupons = dbQueries.insertCouponsToNewUsersQuery(params,couponCode);
                insertCoupons.then((saved)=>{
                    console.log('saved coupons successfully...',saved);
                })
            }
            if (params.deviceType === 'web') {
                console.log('logged in from web....');
                let getNotificationQuery = dbQueries.getNotificationsByUserIDQuery(params);
                getNotificationQuery.then((notifications) => {
                    console.log('notifications length...', notifications.length)
                    if (notifications.length > 0) {
                        var found = false;
                        for (var i = 0; i < notifications[0].devices.web.length; i++) {
                            if (notifications[0].devices.web[i].deviceToken == params.deviceToken) {
                                found = true;
                                // let updateDeviceQuery = dbQueries.updateDeviceIdTokenQuery(params);
                                // updateDeviceQuery.then((update) => {
                                //     console.log('updated...', update);
                                // })
                                break;
                            }
                        }
                        console.log('boolean found...', found);
                        if (found === false) {
                            let updateDeviceByIDQuery = dbQueries.updateDeviceIdTokenByDeviceIdQuery(params, notifications[0]._id);
                            updateDeviceByIDQuery.then((notifyPushed) => {
                                console.log('notify pushed...', notifyPushed);
                            })
                        }
                    } else {
                        let insertDeviceQuery = dbQueries.addingNewDeviceIdTokenQuery(params);
                        insertDeviceQuery.save((success) => {
                            console.log(success);
                        })
                    }
                })
            } else {
                console.log('logged in from mobile....');
                let getNotificationQuery = dbQueries.getNotificationsByUserIDQuery(params);
                getNotificationQuery.then((notifications) => {
                    console.log('notifications length...', notifications.length)
                    if (notifications.length > 0) {
                        console.log(notifications[0].devices.mobile);
                        var found = false
                        for (var i = 0; i < notifications[0].devices.mobile.length; i++) {
                            if (notifications[0].devices.mobile[i].deviceID == params.deviceID) {
                                found = true;
                                let updateDeviceQuery = dbQueries.updateDeviceIdTokenQuery(params);
                                updateDeviceQuery.then((update) => {
                                    console.log('updated...', update);
                                })
                                break;
                            }
                        }
                        console.log('found value....' + found);
                        if (found === false) {
                            console.log(notifications[0]._id);
                            let updateDeviceByIDQuery = dbQueries.updateDeviceIdTokenByDeviceIdQuery(params, notifications[0]._id);
                            updateDeviceByIDQuery.then((notifyPushed) => {
                                console.log('notify pushed...', notifyPushed);
                            })
                        }
                    } else {
                        let insertDeviceQuery = dbQueries.addingNewDeviceIdTokenQuery(params);
                        insertDeviceQuery.save((success) => {
                            console.log(success);
                        })
                    }
                })
            }
            callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: "Customer info update successfully",
                    customerInfo: user,
                    profilePic: imageName
                }
            });
            return;
        } else {
            callback({ status: 200, data: { response: statusCodes.failure, message: "Customer info update failed", customerInfo: user } });
            return;
        }
    });
}

module.exports = customerInfoUpdate;