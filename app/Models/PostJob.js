const mongoose = require('mongoose');
const db = require('./DBConnection');
let schema = mongoose.Schema;
var PostJobSchema = new schema({
    postID: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    userID: {
        type: String,
        required: true
    },
    category: {
        categoryId: {
            type: String,
            required: false
        },
        categoryName: {
            type: String,
            required: false
        },
        required: false,
        type: Object
    },
    postTitle: {
        type: String,
        required: false
    },
    describeTaskInDetails: {
        type: String,
        required: false
    },
    numberOfWorkers: {
        type: Number,
        required: false,
        default: 1
    },
    canThisTaskRemote: {
        type: Boolean,
        requred: false,
        default: false
    },
    location: {
        type: String,
        required: false
    },
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d',      // create the geospatial index
        required: false
    },
    mustHaves: {
        type: Array,
        requred: false
    },
    postedDate: {
        type: String,
        required: false
    },
    taskDate: {
        type: Array,
        required: false
    },
    convenientTimings: {
        type: Array,
        required: false
    },
    postendDate: {
        type: String,
        required: false
    },
    budget: {
        budgetType: {
            Total: {
                type: Boolean,
                required: false,
                default: true
            },
            HourlyRate: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        budget: {
            type: Number,
            required: false,
            default: 0
        },
        Hours: {
            type: String,
            required: false
        },
        pricePerHour: {
            type: Number,
            required: false,
            default: 0
        }
    },
    attachments: [{
        type: String,
        required: false
    }],
    post_Status: {
        type: String,
        required: false
    },
    filled: {
        type: Boolean,
        default: false
    },
    jobAppliedCount: {
        type: Number,
        required: false,
        default: 0
    },
    jobSelectedCount:{
        type: Number,
        required: true,
        default: 0
    },
    favourite: {
        type: Boolean,
        default: false,
        required: false
    },
    postModifyDate: {
        type: String,
        required: false
    },
    comments: [{
        author: {
            type: String,
            required: false
        },
        author_email: {
            type: String,
            required: false
        },
        author_comment: {
            type: String,
            required: false
        },
        author_url: {
            type: String,
            required: false
        },
        author_ip: {
            type: String,
            required: false
        },
        comment_date: {
            type: String,
            required: false
        },
        comment_date_gmt: {
            type: String,
            required: false
        },
        type: Object,
        default: []
    }],
    offers: [{
        authorName: {
            type: String,
            required: false
        },
        offeredUserID: {
            type: String,
            required: false
        },
        authorMessages: [{
            name: {
                type: String,
                required: false
            },
            profilePic: {
                type: String,
                required: false
            },
            message: {
                type: String,
                required: false
            },
            userID: {
                type: String,
                required: false
            },
            timestamp: {
                type: String,
                required: false
            },
        }],
        authorRatings: {
            type: Number,
            required: false
        },
        budget: {
            type: Number,
            required: false
        },
        authorProfilePic: {
            type: String,
            required: false
        },
        type: Object,
        required: false,
        default: []
    }]

});
db.connectToDB();
module.exports = mongoose.model('PostJobs', PostJobSchema);