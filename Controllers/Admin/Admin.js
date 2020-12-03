const AdminInsert = require('./AdminInsert');
const AdminLogin = require('./AdminLogin');
const AdminUpdate = require('./AdminUpdate');
const AdminDelete = require('./AdminDelete');
const FetchAllUsers = require('./CustomerProfile');
//const FetchComments = require('./FetchAllComments');
const PostJobsFetch = require('./FetchPostJobs');
//const OfferedPostJobs = require('./OfferPosts');
const TaskDelete = require('./TaskDelete');
//const FetchBookingsUserID = require('./FetchBookingsUserID');
const PaymentStatus = require('./PaymentAdmin');
const FetchAllBookings = require('./FetchBookings');
const FetchAllPostJobs = require('./FetchAllPostJobs');
const AccountVerification = require('./AdminAccountVerification');
const FetchUsers = require('./FetchUsers');
const Filters = require('./CustomerFilters');
const FetchTask = require('./FetchTasks');
const DeleteComment = require('./DeleteCommentTask');
const DeleteProvidertask = require('./DeleteProviderTask');
const Pagination = require('./AdminPagination');
const Searching = require('./Customersearch');
const Referral = require('./AdminReferrals');
const UpdateUserReferralAsPaid = require('./AdminReferralverification');
const UpdateComment = require('./UpdateComment');
const CustomerDetailsFilter = require('./filterCustomerDetails');
const ProviderDetailsFilter = require('./filterProviderDetails');
const PendingJobPaymentFlter = require('./filterPendingJobPayment');
const referralEarningReport = require('./filterReferralReport');
const NotificaationSend = require('./NotificationSend');
const TotalBookings = require('./TotalBookingsCounts');
const TotalReport = require('./reportsGenerate');
const getBookingReportsToCsv = require('./BookingReportsToCsv');
const getPostJobsFilter = require('./PostjobsFilter');
const getQuickStatus = require('./QuickStatus');
var Admin = {
    insertdata: (params, callback) => {
        return AdminInsert.insert(params, callback);
    },
    logindata: (params, callback) => {
        return AdminLogin.login(params, callback);
    },
    updatedata: (params, callback) => {
        return AdminUpdate.update(params, callback);
    },
    deletedata: (params, callback) =>{
        return AdminDelete.delete(params, callback);
    },
    fetchuser: (params,callback) => {
        return FetchAllUsers.fetchdata(params,callback);
    },
    fetchcomments:(params,callback)=>{
        return FetchComments.fetchcomments(params,callback);
    },
    fetchjobs:(params,callback)=>{
        return PostJobsFetch.fetchpostjobs(params,callback);
    },
    fetchofferpostjobs:(params,callback)=>{
        return OfferedPostJobs.fetchofferpostjobs(params,callback);
    },
    taskdelete: (params, callback) => {
        return TaskDelete.taskdelete(params,callback);
    },
    fetchbooking:(params,callback)=>{
        return FetchBookingsUserID.fetchbookings(params,callback);
    },
    fetch: (params,callback) =>{
        return PaymentStatus.status(params,callback);
    },
    bookings: (params,callback) => {
        return FetchAllBookings.bookingsFetch(params,callback);
    },
    fetchallpostjobs: (params,callback) => {
        return FetchAllPostJobs.fetchjobs(params,callback);
    },
    Accountupdatedata: (params,callback) => {
        return AccountVerification.updatedata(params, callback);
    },
    fetchingdata: (params,callback) => {
            return FetchUsers.fetchingdata(params,callback);
        },
    filter: (params,callback) => {
        return Filters.filterStatus(params,callback);
    },
    taskfetch: (params,callback) => {
        return FetchTask.fetchtask(params,callback);
    },
    deletecomment: (params,callback) => {
        return DeleteComment.commentdelete(params,callback);
    },
    deleteprovidertask: (params,callback) => {
        return DeleteProvidertask.providertaskdelete(params,callback);
    },
    fetchpagination: (params,callback) => {
        return Pagination.pagination(params,callback);
    },
    searchingName: (params,callback) => {
        return Searching.nameSearching(params,callback);
    },
    referralUser: (params,callback) => {
        return Referral.referral(params,callback);
    },
    updatecomment: (params,callback) => {
        return UpdateComment.commentupdate(params,callback);
    },
    getCustomerDetails : (params,res,callback) =>{
        return CustomerDetailsFilter.CustomerDetailsFilterData(params,res,callback);
    },
    getProviderDetails :(params,res,callback) => {
        return ProviderDetailsFilter.providerDetailsfilterData(params,res,callback);
    },
    getpendingPaymentJobDetails :(params,res,callback) =>{
        return PendingJobPaymentFlter.pendingJobPaymentDetailsfilterData(params,res,callback);
    },
    getreferralReport :(params,res,callback) =>{
        return referralEarningReport.referralReport(params,res,callback);
    },
    sendNotification : (params,callback) =>{
        return NotificaationSend.SendNotificationToEmails(params,callback);
    },
    getTotalBookings :(params,callback)=>{
        return TotalBookings.getTotalBookingCounts(params,callback);
    },
    genarateAllReports:(params,res)=>{
        return TotalReport.getAllReports(params,res);
    },
    BookingsReports :(params,res,callback) =>{
        return getBookingReportsToCsv.BookedReportToCsv(params,res,callback);
    },
    fetchAdminNotification : (params,callback) =>{
        return NotificaationSend.fetchAdminNotifications(params,callback);
    },
    fetchCustomersIDs:(params,callback)=>{
        return NotificaationSend.fetchFilteredCustomers(params,callback);
    },
    deleteNitification:(params,callback)=>{
        return NotificaationSend.deleteAdminNotification(params,callback);
    },
    getPostjobsFilter : (params,callback) =>{
        return getPostJobsFilter.getFilterPostjobs(params,callback);
    },
    getQuickStatus :(params,callback) =>{
        return getQuickStatus.getStatusDashboard(params,callback);
    },
    paidReferralAmountMarkAsPaid:(params,callback)=>{
        return UpdateUserReferralAsPaid.referralpaid(params,callback);
    }
}
module.exports = Admin;