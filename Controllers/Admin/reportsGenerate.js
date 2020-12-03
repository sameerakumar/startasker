const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');
const stringify = require('csv-stringify');
const generate = require('csv-generate');

var FilterProviderDetails ={
  getAllReports : (params,res) =>{
    const { error } = paramValidator.validateReportsDetailsParams(params);
    if (error) {
      res.json({ status: 400,
        data: {
          response: statusCodes.failure,
          message: error.details[0].message
        }
      });
    }
    var rtype = params.reportType;
    
    switch(rtype){
      case 'Customer':
        customerReports(params,res);
      break;
      case 'Provider':
        providerReports(params,res);
      break;
      case 'Bookings':
        var status ='reportStatus';
        var st = params.hasOwnProperty(status);
        if(st){
          pendingJobsReports(params,res);
        }
        else{
          res.json({ status :200,
            data : {
              response : statusCodes.failure,
              message : "Please pass correct reportStaus",
            }
          });
        }
        
      break;
      case 'Referral':
        referralReported(params,res);
      break;
      default:
        res.json({ status :200,
          data : {
            response : statusCodes.failure,
            message : "Please pass correct Customer/Provider/PendingJobs/Referral",
          }
        });
    }
    function customerReports(params,res) {
      let CustomerDetailsData = dbQueries.getCustomerDetails(params);
      CustomerDetailsData.then((foundData)=>{
        if(foundData){  
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Pragma', 'no-cache');    
          generate({
            objectMode: true,
            seed: 1,
            headers: 2
          })
          stringify(foundData, { header: true, 
            columns: {
              userID : 'Email ID',
              firstName : 'First Name',
			        lastName :'Last Name',
			        postTask :'Posted Task',
			        completeTask :'completed Task',
			        countryCode :'Country code',
			        phoneNumber :'Contact number',
			        dob :'Date of birth',
			        register_time :' register Date',
			        register_type :'type of register',
			        address :'Address',
			        city : 'City',
			        state :' State',
			        country :'Country',
			        zipCode : 'pin code',
			        region : 'Region',
			        description :'descriptions',
			        'Facebook.facebookID' : 'Facebook ID',
			        'Google.GoogleID' :'Google ID',
			        'BankAccountDetailes.Accountholdername' :'AccountName',
			        'BankAccountDetailes.AccounNumber' :'Account Number',			
              coupons : 'Coupons Info',
            } 
          })
          .pipe(res); 
        }
        else{
          res.json({ status :200,
            data : {
              response : statusCodes.failure,
              message : "Data not found from DB"
            }
          })
        }
      }).catch((error)=>{
        console.log(error);
      })            
    }

    function providerReports(params,res) {
      let CustomerDetailsData = dbQueries.getProviderDetails(params);
      CustomerDetailsData.then((foundData)=>{
        if(foundData){
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Pragma', 'no-cache');    
          generate({
            objectMode: true,
            seed: 1,
            headers: 2
          })
          stringify(foundData, { header: true, 
            columns: {
              userID : 'Email ID',
              firstName : 'First Name',
			        lastName :'Last Name',
			        postTask :'Posted Task',
			        completeTask :'completed Task',
			        countryCode :'Country code',
			        phoneNumber :'Contact number',
			        dob :'Date of birth',
			        register_time :' register Date',
			        register_type :'type of register',
			        address :'Address',
			        city : 'City',
			        state :' State',
			        country :'Country',
			        zipCode : 'pin code',
			        region : 'Region',
			        description :'descriptions',
			        'Facebook.facebookID' : 'Facebook ID',
			        'Google.GoogleID' :'Google ID',
			        'BankAccountDetailes.Accountholdername' :'AccountName',
			        'BankAccountDetailes.AccounNumber' :'Account Number',			
              coupons : 'Coupons Info',
            } 
          })
          .pipe(res);
        }
        else{
          res.json({ status :200,
            data : {
              response : statusCodes.failure,
              message : "Data not found from DB"
            }
          })
        }
      }).catch((error)=>{
        console.log(error);
      })      
    }

    function  pendingJobsReports(params,res) {
      let CustomerDetailsData = dbQueries.getPendingJobPaymentDetails(params);
      CustomerDetailsData.then((foundData)=>{
        if(foundData){  
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Pragma', 'no-cache');   
          generate({
            objectMode: true,
            seed: 1,
            headers: 2
          })
          stringify(foundData, { header: true, 
            columns: {
              bookingID : 'Booking ID',
			        postID :'Post id',
              serviceCategory : 'service Category',
              taskTitle :'task title',
              userID : 'user id',
              bookedTaskers:'booking tasker',
              taskDate :'Task Date',
         	    paymentData : 'payment Info',
              paymentDate :'payment date ',
              paymentStatus :'payment Status',
              paymentTo :'To payment',
              couponCode :' coupon Code',
              couponDiscount :' Discount',
              couponAmount:'Amount coupon',		
              customerName : 'Customer Name',
              paymentDate : 'Payment Info',
              convenientTimings: 'convenientTimings',
              mustHaves: 'mustHaves',
              attachments: 'attachments',
              isTaskCompleted: 'isTaskCompleted',
              taskTotalBudget: 'taskTotalBudget',
              customerProfilePic: 'customerProfilePic',
              location: 'location',
              describeTaskInDetails: 'describeTaskInDetails'
            } 
          })
          .pipe(res);
        }
        else{
          res.json({ status :200,
            data : {
              response : statusCodes.failure,
              message : "Data not found from DB"
            }
          })
        }
      }).catch((error)=>{
        console.log(error);
      })  
    }

    function referralReported(params,res) {
      let referralDetailsData = dbQueries.getReferralDetails(params);
      referralDetailsData.then((foundData)=>{
        if(foundData){
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Pragma', 'no-cache');
          generate({
            objectMode: true,
            seed: 1,
            headers: 2
          })
          stringify(foundData, { header: true, 
            columns: {
              referralCode : 'referral codes',
			        referByuserID :'refer by user',
			        referToUserID :'refer to user',
              taskTitle : 'Task Name',
			        PostID :'posted Id',
			        bookingID :'booked id',
			        bookingAmount :'booked Amount',
			        earningTimestamp :'Earned Date',
			        earnAmount :'Earning Amount',
			        transferDate :'tranfer Date',
              isTaskar : 'Taskar/provider',
            } 
          })
          .pipe(res);
        }
        else{
          res.json({ status :200,
            data : {
              response : statusCodes.failure,
              message : "Data not found from DB"
            }
          })
        }
      }).catch((error)=>{
        console.log(error);
      })  
    }
  }
}
module.exports = FilterProviderDetails;