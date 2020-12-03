const mongoose = require('mongoose');
const { string } = require('@hapi/joi');
let schema = mongoose.Schema;
var BookingsSchema = new schema({

    bookingID: {
        type: String,
        required: true
    },
    postID: {
        type: String,
        required: true,
    },
    serviceCategory:{
        type: String,
        required: false
    },
    taskTitle: {
        type: String,
        required: false
    },
    userID: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: false
    },
    customerProfilePic:{
        type: String,
        required: false
    },
    bookedTaskers: [{
        offeredUserID: {
            type: String,
            required: false
        },
        offeredUserName: {
            type: String,
            required: false
        },
        offerdUserProfilePic:{
            type:String,
            required:false
        },
        budget: {
            type: Number,
            required: false
        },
        isTaskerCompletedTask:{
            type: Boolean,
            default: false
        },
         paymentStatusToProviderByAdmin:{
             type: Boolean,
             default: false
         },
         isWithDraw:{
            type: String,
            default:false
         },
        type: Object,
        required: false,
        default: []
    }],
    location:{
        type: String,
        required: false
    },
    convenientTimings: {
        type: Array,
        required: false
    },
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d',      // create the geospatial index
        required: false
    },
    describeTaskInDetails: {
        type: String,
        required: false
    },
    mustHaves: {
        type: Array,
        requred: false
    },
    taskDate: {
        type: Array,
        required: false
    },
    attachments: {
        type: Array,
        required: false
    },
    isTaskCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    taskTotalBudget: {
        type: Number,
        required: false
    },
    paymentID: {
        type: String,
        required: false
    },
    paymentData: {
        type: Object,
        required: true,
        default:{Object}
    },
    paymentDate: {
        type: String,
        required: false
    },
    invoiceLink: {
        type: String,
        required: false
    },   
    paymentStatus: {
        type: String,
        required: false,
        default: 'pending'
    },
    startTime: {
        type: String,
        required: false
    },
    endTime: {
        type: String,
        required: false
    },
    serviceTax: {
        type: String,
        required: false
    },
    paymentTo: {
        type: String,
        required: false,
        default: 'Admin'
    },
    couponCode: {
        type: String,
        required: false
    },
    couponDiscount: {
        type: String,
        required: false
    },    
    couponExpiryDate: {
        type: String,
        required: false
    },
    couponAmount: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('Bookings', BookingsSchema);