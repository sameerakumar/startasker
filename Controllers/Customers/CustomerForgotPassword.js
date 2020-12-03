const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const RandomOTP = require('../Core/GenerateOTP');
const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const Mailer = require('../Core/Mailer');

var customerForgotPassword = {
    forgot: (params, callback) => {
        const { error } = paramValidations.validateForgotPasswordParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let forgotQuery = dbQueries.getCustomerQuery(params);
        forgotQuery.then((user) => {
            if (user) {                                                     
                    let otp = RandomOTP.generateOTP();
                    let updateQuery = dbQueries.prepareForgotPasswordOTPUpdate(params.userID, otp);
                    updateQuery.then((updated_record) => {
                        if (updated_record) {
                            if(params.isReSendOtp == true){
                                Mailer.resentOTPRequestMail("Resend OTP - OTP Verify", params.userID, otp);
                                callback({ status: 200, data: { response: statusCodes.success, message: "OTP sent to registered mail" } });
                                return;
                            }
                                Mailer.userForgotPasswordOTPSentToMail("Forgot Password - OTP Verify", params.userID, otp);
                                callback({ status: 200, data: { response: statusCodes.success, message: "OTP sent to registered mail" } });
                                return;
                                                       
                        } else {
                            callback({ status: 200, data: { response: statusCodes.failure, message: "OTP sending failed" } });
                            return;
                        }
                    }).catch((error) => {
                        console.log(error);
                    })              

            } else {
                callback({ status: 200, data: { response: statusCodes.failure, message: "No data found with us. Please register with us." } });
                return;
            }
        });
    }

}

module.exports = customerForgotPassword;