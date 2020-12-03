const dbQueries = require('../Bookings/BookingsDBQueries');
const statusCodes = require('../../Controllers/Core/StatusCodes');
const paramValidations = require('../Bookings/BookingsParametersValidations');

var InsertNewPartialBooking = {
    partialBooking:(params,callback)=>{
        const { error } = paramValidations.partialNewBookingParamsValidations(params);
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
        let getPostQuery = dbQueries.getUserPostIDQueryFromPostID(params.postID);
        getPostQuery.then((ifFound) => {
            if (ifFound) {
                if (ifFound.post_Status === 'Assigned') {
                    callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: "This post already assigned"
                        }
                    });
                    return;
                } else {
                    let fetchBookingByItsID = dbQueries.getBookingsBasedOnBookingIDQuery(params);
                    fetchBookingByItsID.then((found)=>{
                        if(!found){
                           let NewPartialBookingQuery = dbQueries.insertNewPartialBookingQuery(params);
                           NewPartialBookingQuery.save((err)=>{
                               if(err){
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.failure,
                                        message: err
                                    }
                                });
                               }else{
                                updateProviderStatusAsBooked(params,ifFound.numberOfWorkers,ifFound.jobSelectedCount)
                                return callback({
                                    status: 200,
                                    data: {
                                        response: statusCodes.success,
                                        message: "Booking data saved successfully"
                                    }
                                });
                               }
                           })
                        }else{
                            callback({
                                status: 200,
                                data: {
                                    response: statusCodes.failure,
                                    message: "BookingID already available"
                                }
                            });
                            return;
                        }
                    })
                }
            }
            })
       
    }
}
function updateProviderStatusAsBooked(params, totalWorkersCount, bookedTaskersCount) {
    console.log('array length...', params.bookedTaskers.length);
    var totalTaskersCount = totalWorkersCount;
    var bookedTaskerCount = bookedTaskersCount + params.bookedTaskers.length;
    if (bookedTaskerCount == totalTaskersCount) {
        for (var i = 0; i < params.bookedTaskers.length; i++) {
            var offeredUserID = params.bookedTaskers[i].offeredUserID;
            let updateQuery = dbQueries.updateProviderHiredStatusInPostJob(params, offeredUserID);
            updateQuery.then((updated) => {      
                console.log('provider hired status updated...',updated)          
            })
        }
        let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(bookedTaskerCount, params.postID);
        jobCountUpdateQuery.then((updated)=>{
            console.log('jobcount updated...',updated);
        })
        let statusUpdate = dbQueries.getPostJobStatusUpdateQuery(params.postID);
        statusUpdate.then((updated)=>{
            console.log('postjob status updated...',updated);
        })
        if(params.couponCode != null){
            let couponUpdate = dbQueries.customerCouponUpdateQuery(params);
            couponUpdate.then((updated)=>{
                console.log('coupon updated...',updated);
            })
        }
    } else {
        for (var i = 0; i < params.bookedTaskers.length; i++) {
            var offeredUserID = params.bookedTaskers[i].offeredUserID;
            let updateQuery = dbQueries.updateProviderHiredStatusInPostJob(params, offeredUserID);
            updateQuery.then((updated) => {
                console.log('updates success...', updated);                
            })
        }
        let jobCountUpdateQuery = dbQueries.updateJobSelectedCountQuery(bookedTaskerCount, params.postID);
        jobCountUpdateQuery.then((updated)=>{
            console.log('jobcount updated...',updated);
        })
        if(params.couponCode != null){
            let couponUpdate = dbQueries.customerCouponUpdateQuery(params);
            couponUpdate.then((updated)=>{
                console.log('coupon updated...',updated);
            })
        }
    }
}

module.exports = InsertNewPartialBooking;