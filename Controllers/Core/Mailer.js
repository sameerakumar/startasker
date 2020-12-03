var nodemailer = require('nodemailer');
var config = require('../../app/ConfigFiles/config.json');
var fs = require('fs');
var pdf = require('html-pdf');
var async = require('async');
const moment = require('moment-timezone');

var mail = {
    passwordSentToMail: function (subject, toEmail, password) {
        sendMail(toEmail, subject, password);
    },

    userOTPSentToMail: function (subject, toEmail, otp) {
        fs.readFile('./app/ConfigFiles/Startasker-email.html', function (err, data) {
            if (!err) {
                var str = data.toString();
                var html = str.replace("%s", otp);
                sendOTPTOMail(toEmail, subject, html);
            }
            else {
                console.log(err);
            }
        });
    },
    userForgotPasswordOTPSentToMail: function (subject, toEmail, otp) {
        fs.readFile('./app/ConfigFiles/ForgotPassword.html', function (err, data) {
            if (!err) {
                var str = data.toString();
                var html = str.replace("%s", otp);
                sendOTPTOMail(toEmail, subject, html);
            }
            else {
                console.log(err);
            }
        });
    },
    resentOTPRequestMail: function (subject, toEmail, otp) {
        fs.readFile('./app/ConfigFiles/ResendOtp.html', function (err, data) {
            if (!err) {
                var str = data.toString();
                var html = str.replace("%s", otp);
                sendOTPTOMail(toEmail, subject, html);
            }
            else {
                console.log(err);
            }
        });
    },
    userReportTaskSentToMail: function (subject, toEmail, message) {
        sendReportTOMail(toEmail, subject, message);
    },
    sendToCustomerMail: function (subject, toEmail, customerName, taskerName, title, loc, date, time, location, phone, email, params) {
        fs.readFile('./app/ConfigFiles/CustomerWithoutPrivateConversation.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#cn#", customerName);
                html = html.replace("#tn#", taskerName);
                html = html.replace("#tn1#", taskerName);
                html = html.replace("#tn2#", taskerName);
                html = html.replace("#tn3#", taskerName);
                html = html.replace("#loc#", loc);
                html = html.replace("#title#", title);
                html = html.replace("#date#", date);
                html = html.replace("#time#", time);
                html = html.replace("#location#", location);
                html = html.replace("#pname#", taskerName);
                html = html.replace("#pemail#", email);
                html = html.replace("#pphone#", phone);
                fs.readFile('./app/ConfigFiles/invoice.html', function (err1, data1) {
                    if (!err1) {
                        var time = moment
                        .unix(new Date().getTime() / 1000 + 1000)                        
                        .tz("Asia/Kuala_Lumpur")
                        .format('MM/DD/YYYY hh:mm A');
                        const words = time.split(' ');
                        var html1 = data1.toString();
                        html1 = html1.replace('%date', words[0]);
                        html1 = html1.replace('%time', words[1]);
                        html1 = html1.replace('%p', words[2]);
                        html1 = html1.replace('%total', params.taskTotalBudget);
                        html1 = html1.replace('%category', params.serviceCategory);
                        html1 = html1.replace('%provider', taskerName);
                        html1 = html1.replace('%poster', customerName);
                        html1 = html1.replace('%bookingID', params.bookingID);
                        html1 = html1.replace('%location', location);
                        html1 = html1.replace('%modeofpayment', params.paymentData.PymtMethod);
                        html1 = html1.replace('%title', params.taskTitle);
                        html1 = html1.replace('%total1', params.taskTotalBudget);
                        html1 = html1.replace('%total2', params.taskTotalBudget);
                        sendInvoiceToCustomerMail(toEmail, subject, html, html1, params.bookingID);
                    }
                })
                ///sendOTPTOMail(toEmail,subject,html); 
            }
            else {
                console.log(err);
            }
        });
    },
    sendToTaskerMail: function (subject, toEmail, customerName, taskerName, title, loc, date, time, location, phone, email) {
        fs.readFile('./app/ConfigFiles/ProviderWithOutPrivateConversation.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#tn#", taskerName);
                html = html.replace("#cn#", customerName);
                html = html.replace("#cn1#", customerName);
                html = html.replace("#loc#", loc);
                html = html.replace("#title#", title);
                html = html.replace("#date#", date);
                html = html.replace("#time#", time);
                html = html.replace("#location#", location);
                html = html.replace("#cname#", customerName);
                html = html.replace("#cemail#", email);
                html = html.replace("#cphone#", phone);
                sendOTPTOMail(toEmail, subject, html);
            }
            else {
                console.log(err);
            }
        });
    },
    sendAdminPaymentConfirmationToCustomer: function (params,found) {
        fs.readFile('./app/ConfigFiles/AdminProviderPaymentConfirmationToCustomer.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#tn#", params.offeredUserName);
                html = html.replace("#title#", found.taskTitle);
                html = html.replace("#cname#", found.customerName);
                sendOTPTOMail(found.userID, "AdminPaymentProcessed - Provider", html);
            }
            else {
                console.log(err);
            }
        });
    },
    sendAdminPaymentConfirmationToProvider: function (params,found) {
        fs.readFile('./app/ConfigFiles/AdminProviderPaymentConfirmationToProvider.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#tn#", params.offeredUserName);
                html = html.replace("#title#", found.taskTitle);
                html = html.replace("#amount#", params.Amount);
                sendOTPTOMail(params.offeredUserID, "AdminPaymentProcessed - Provider", html);
            }
            else {
                console.log(err);
            }
        });
    },
    accountVerificationNotification: function (subject, toEmail,firstName) {
        fs.readFile('./app/ConfigFiles/accountverification.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#cn#", firstName);
                sendOTPTOMail(toEmail, subject,html);
            }
            else {
                console.log(err);
            }
        });
    },
    accountVerificationNotificationWithReason: function (subject, toEmail,firstName,reason) {
        fs.readFile('./app/ConfigFiles/accountverificationreason.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#cn#", firstName);
                html = html.replace("#reason#", reason);
                sendOTPTOMail(toEmail, subject,html);
            }
            else {
                console.log(err);
            }
        });
    },
    sendJobRemainderToCustomer: function (subject, userID, title, name) {
        fs.readFile('./app/ConfigFiles/JobReminderToCustomer.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#title#", title);
                html = html.replace("#cname#", name);
                sendOTPTOMail(userID, subject, html);
            }
            else {
                console.log(err);
            }
        });
    },
    sendJobRemainderToProvider: function (subject, userID, title, name) {
        fs.readFile('./app/ConfigFiles/JobReminderToProvider.html', function (err, data) {
            if (!err) {
                var html = data.toString();
                html = html.replace("#cname#" , name);
                html = html.replace("#title#", title);
                sendOTPTOMail(userID, subject, html);
            }
            else {
                console.log(err);
            }
        });
    },

}

function sendMail(toEmail, subject, password) {
    var transporter = nodemailer.createTransport({
        name: 'SMTP',
        host: 'mail.startasker.com',
        port: 465,
        secure: true,
        auth: {
            user: config.authMail,
            pass: config.authMailPassword
        }
    });
    var mailOptions = {
        from: config.fromMail,
        to: toEmail,
        subject: subject,
        text: password
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }
    });
}
function sendOTPTOMail(toEmail, subject, html) {
    var transporter = nodemailer.createTransport({
        //service: config.mailService,
        name: 'SMTP',
        host: 'mail.startasker.com',
        port: 465,
        secure: true,
        auth: {
            user: config.authMail,
            pass: config.authMailPassword
        }
    });
    var mailOptions = {
        from: config.fromMail,
        to: toEmail,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }
    });

}
function sendReportTOMail(toEmail, subject, message) {
    var transporter = nodemailer.createTransport({
        name: 'SMTP',
        host: 'mail.startasker.com',
        port: 465,
        secure: true,
        auth: {
            user: config.authMail,
            pass: config.authMailPassword
        }
    });
    var mailOptions = {
        from: config.fromMail,
        to: config.fromMail,
        subject: subject,
        text: message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }
    });
}
function sendInvoiceToCustomerMail(toEmail, subject, html, html1, bookingID) {
    var transporter = nodemailer.createTransport({
        //service: config.mailService,
        name: 'SMTP',
        host: 'mail.startasker.com',
        port: 465,
        secure: true,
        auth: {
            user: config.authMail,
            pass: config.authMailPassword
        }
    });
    var mailOptions;
    async.parallel(pdf.create(html1).toBuffer((err, resul)=> {
        if (err) return console.log(err);
        if (resul) {
            mailOptions = {
                from: config.fromMail,
                to: toEmail,
                subject: subject,
                html: html,
                attachments: { filename: bookingID + ".pdf", content: resul }
                // [{   // filename and content type is derived from path
                //     path: toPath
                // }]
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);

                } else {
                    console.log('Email sent: ' + info.response);

                }
            });
        }
    })
    );

}
module.exports = mail;