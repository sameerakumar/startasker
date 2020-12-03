const dbQueries = require('../Bookings/BookingsDBQueries');
const AdminDBQueries = require('../../Controllers/Admin/AdminDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');
const Mailer = require('../Core/Mailer');

var FundsReleaseToProviders = {

    requestingFundsByProviders:(params,callback)=>{
        const { error } = paramValidations.validateFundsReleaseToProvidersParameters(params);
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
        let fetchBookingWithID = dbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchBookingWithID.then((found)=>{
            if(found){              
                Mailer.userReportTaskSentToMail("Startasker - Requesting For Fund Release","","Please initiate fund release for provider" +params.offeredUserID+ "with booking ID is." +params.bookingID);
                var boolean = false;
                for(var tasker of found.bookedTaskers){
                    if(tasker.offeredUserID === params.offeredUserID){
                        boolean = true;
                        var data = {
                            notification: {
                                "title": "Request provider for funds release",
                                "body": "Provider " + tasker.offeredUserName,
                                "sound": "default",
                                "icon":"https:/api.startasker.com/startasker-new-logo2-1.png",
                                "click_action": "https://www.startasker.com/#/bookings/booking-job-details/" + found.bookingID
                            },
                            data: {
                                "profilePic": tasker.offeredUserProfilePic,
                                "userID": tasker.userID,
                                "postID": found.postID,
                                "bookingID": found.bookingID,
                                "type": "FundRelease",
                                "completedTo":"Admin"
                            }
                        }
                        let adminSentNotificationQuery = AdminDBQueries.addingPushNotificationsToAdminRecieveInboxQuery("enquiry@startasker.com",data);
                        callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Request sent to admin successfully"
                            }
                        });
                        return;
                    }
                    break;
                }
                
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No booking data found with this ID"
                    }
                });
                return;
            }
        })
    }

}

module.exports = FundsReleaseToProviders;