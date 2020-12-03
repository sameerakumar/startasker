const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');

var DeletePartialBooking = {
    deleteBooking:(params,callback)=>{
        const { error } = paramValidations.validateFetchCustomerBookingsWithBookingIDParameters(params);
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
        let fetchBookingByItsID = dbQueries.getBookingsBasedOnBookingIDQuery(params);
        fetchBookingByItsID.then((found)=>{
            if(found){
               deleteProviderFromOffersFromPostJobs(found,() =>{
                let deletePartialBookingQuery = dbQueries.deletePartialBookingParams(params);
                deletePartialBookingQuery.then((success)=>{
                    if(!success){
                     return callback({
                         status: 200,
                         data: {
                             response: statusCodes.failure,
                             message: err
                         }
                     });
                    }else{                    
                     return callback({
                         status: 200,
                         data: {
                             response: statusCodes.success,
                             message: "Booking deleted successfully"
                         }
                     });
                    }
                })
               });               
              
            }else{
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "BookingID not found to delete"
                    }
                });
                return;
            }
        })
    }
}

function deleteProviderFromOffersFromPostJobs(bookingDetails,callback){    
    var bookedTaskers = bookingDetails.bookedTaskers;
    var bookedTaskersCount = bookingDetails.length; 
    for(var i=0;i<bookedTaskers.length;i++){
        var offeredUserID = bookedTaskers[i].offeredUserID;
        let updateQuery = dbQueries.updateProviderUnHiredStatusInPostJob(bookingDetails.postID,offeredUserID);
        updateQuery.then((updated) => {
            console.log('provider unhired success...',updated);
        })
    }
    let getPostQuery = dbQueries.getUserPostIDQueryFromPostID(bookingDetails.postID);
    getPostQuery.then((post) => {
        console.log('db job selected count...',post.jobSelectedCount);
        if(post.jobSelectedCount >0){
            console.log('booked tasker length...',bookedTaskersCount);
            var count = post.jobSelectedCount - bookedTaskersCount;            
                let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(count, bookingDetails.postID);
                jobCountUpdateQuery.then((update)=>{
                    console.log('db job selected count...',post.jobSelectedCount);
                })
                let updatePostStatusQuery = dbQueries.updatePostJobStatusAsOpenQuery(bookingDetails.postID);
                updatePostStatusQuery.then((updated) => {
                    console.log('db job selected count...',post.jobSelectedCount);
                })
            
        }        
    });   
    callback();
}
module.exports = DeletePartialBooking;