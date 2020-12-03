const Bookings = require('./InsertingNewBookings');
const FetchBookings = require('./FetchBookings');
const JobWithDraw = require('./JobWithDraw');
const JobCompleted = require('./JobCompleted');
const RequestForFundRelease = require('./FundsReleaseToProviders');
const BookingPaymentStatusUpdate = require('./PaymentStatusUpdate');
const PartialBooking = require('./InsertPartialBooking');
const DeleteBooking = require('./DeletePartialBooking');
const HiringProviderForTask = require('./HireProviderForNewBooking');
var BookingController = {

    newBookings:(params,callback) =>{
        return Bookings.insertNewBooking(params,callback);
    },
    getBookingByUserID:(params,callback) =>{
        return FetchBookings.fetchBookingBasedOnUserID(params,callback);
    },
    getBookingsByBookingID:(params,callback) =>{
        return FetchBookings.fetchBookingBasedOnBookingID(params,callback);
    },
    jobWithDrawnByCustomer:(params, callback) =>{
        return JobWithDraw.withDrawByCustomer(params,callback);
    },
    customerProvideWorkCompletedToProviders:(params,callback) =>{
        return JobCompleted.jobCompleteStatusProvideByCustomer(params,callback);
    },
    sentRequestForFundRelease:(params,callback)=>{
        return RequestForFundRelease.requestingFundsByProviders(params,callback);
    },
    updatePaymentStatus:(params,callback)=>{
        return BookingPaymentStatusUpdate.checkPaymentStatus(params,callback);
    },
    newPartialBooking:(params,callback)=>{
        return PartialBooking.partialBooking(params,callback);
    },
    deletePartialBooking:(params,callback)=>{
        return DeleteBooking.deleteBooking(params,callback);
    },
    hiringTaskProvider:(params,callback)=>{
        return HiringProviderForTask.hireProviderForTask(params,callback);
    }

}

module.exports = BookingController;