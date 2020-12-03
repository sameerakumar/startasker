const mongoose = require('mongoose');
const db = require('./DBConnection');
let schema = mongoose.Schema;
var CustomerSchema = new schema({

    userID: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    postTask: {
        type: Boolean,
        required: false,
        default: false
    },
    completeTask: {
        type: Boolean,
        required: false,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    countryCode: {
        required: false,
        type: String
    },
    phoneNumber: {
        required: false,
        type: String
    },
    otp: {
        type: String,
        required: true
    },
    otp_time: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: false,
		default: ''
    },
    verification_status: {
        type: Boolean,
        default: false,
        required: true
    },
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d',      // create the geospatial index
        required: false
    },
    register_time: {
        type: String,
        required: false
    },
    register_type: {
        type: String,
        required: false
    },
    login_type: {
        type: String,
        required: false
    },
    prefer_language: {
        type: String,
        required: true,
        default: 'English'
    },
    profilePic: {
        type: String,
        required: false,
		default: ''
    },
    address: {
        type: String,
        required: false
    },
    apt: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zipCode: {
        type: Number,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    region: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    login_status: {
        type: Boolean,
        default: false
    },
    Facebook: {
        facebookID: {
            type: String,
            required: false
          
        },
        tokenId: {
            type: String,
            required: false
        }

    },
    Google: {
        GoogleID: {
            type: String,
            required: false
        },
        tokenId: {
            type: String,
            required: false
        }
    },
    Apple:{
        AppleID:{
            type: String,
            required: false
        },
        tokenId: {
            type: String,
            required: false
        }
    },
    isProfileUpdate:{
        type: Boolean,
        required: true,
        default: false
    },
    BankAccountDetailes:{
        Accountholdername:{
            type:String,
            required:false
        },
        AccountNumber:{
            type:String,
            required:false
        },
        BSB:{
            type:String,
            required:false
        },
        required: false,
        type: Object,
        default: null
    },
    BillingAddress: {
        AddressLine1: {
            type: String,
            required: false
        },
        AddressLine2: {
            type: String,
            required: false
        },
        Suburb: {
            type: String,
            required: false
        },
        State: {
            type: String,
            required: false
        },
        Postcode: {
            type: String,
            required: false
        },
        Country: {
            type: String,
            required: false
        },
        required: false,
        type: Object,
        default: null
    },
    search_Configurations:{
        lat:{
            type: String,
            required:false
        },
        long: {
            type: String,
            required: false
        },
        radius: {
            type: String,
            required: true,
            default: '5000'
        },
        maxPrice:{
            type: String,
            required: true,
            default: '9999'
        },
        minPrice:{
            type:String,
            required:true,
            default: '5'
        },
        // taskStates:{
        //     type: String,
        //     required: false,
        //     enum: ['post','assigned','completed','overdue','closed','expired','draft','allocated'],
        //     default: 'post'
        // },
        taskTypes: {
            type: String,
            required: true,
            enum: ['In person','Remotly','All'],
            default: 'All'
        },
        locationName:{
            type:String,
            required: false
        },
        hideAssignedTask: {
            type: Boolean,
            required: true,
            default: false
        }        
    },
    isGivenAppRatings:{
        type: Boolean,
        required: false,
        default: false
    },
    gallery:{
        type: Array,
        required: false,
        default: []
    },
    accountVerificationStatus:{
        type: String,
        required: true,
        default: 'Unverified'
    },
    businessNumber: {
        type: String,
        required: false,
        default: ''
    },
    aboutMe: {
        type: String,
        required: false,
        default: ''
    },
    isActive:{
        type: Boolean,
        required: true,
        default: true
    },
    activeTimestamp:{
        type: String,
        required: false
    },
    coupons:{
        type:Array,
        required: false,
        default:[]
    },
    isOldUser: {
        type: Boolean,
        required: false,
        default: false
    },
    signupReferralInfo:{
        referralCode:{
            type: String,
        },
        userID:{
            type: String,  
        },
        type: Object,
        required: false,
    },
    referralCode:{
        type: String,
        unique :true,
        index : true,
        required: false
    },
    isFirstTaskDone:{
        type: Boolean,
        default:false
    },
    deviceInfo:{
        
    }
});
db.connectToDB();
module.exports = mongoose.model('Customers', CustomerSchema);