const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamValidations');
const statusCodes = require('../Core/StatusCodes');
const stringify = require('csv-stringify');
const generate = require('csv-generate');

var BookingReportToCsvDetails ={
  BookedReportToCsv : (params,res,callback) =>{
    const { error } = paramValidator.validateBookingReportDetailsParams(params);
    if (error) {
      return callback({ status: 400,
        data: {
          response: statusCodes.failure,
          message: error.details[0].message
        }
      });
    }
    let BookingReportDetailsData = dbQueries.getBookingReportDetails(params);
    BookingReportDetailsData.then((foundData)=>{
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
            bookingID :"Booked ID",
            postID :"Task ID",
            serviceCategory :"Service Category",
            taskTitle :"Title Task",
            userID :"User ID",
            customerName:"Customer Name",
            paymentDate :"Payment Date",
            paymentStatus :"Payment Status",
            paymentTo :"Payment To",
            couponCode : "Coupon Codes",
            couponDiscount :" coupon Discount",
            couponExpiryDate:"coupon Expire Date",
            couponAmount:"Amount of coupon",
            startTime :"Time start",
            endTime :"End Time",
            taskTotalBudget:"Task Total Budget",
            bookedTaskers :"Providers"            
          } 
        })
        .pipe(res); 
      }
      else{
        return callback({ status :200,
          data:{
            response : statusCodes.failure,
            message :"data not retrive from database"
          }  
        });        
      }
    }).catch((error)=>{
      console.log(error);
    })
  }
}
module.exports = BookingReportToCsvDetails;