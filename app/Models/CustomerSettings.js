const mongoose = require('mongoose');
let schema = mongoose.Schema;
var CustomerSettingsSchema = new schema({

    userID: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    skills: {
        trasportations: {
            Bicycle: {
                type: Boolean,
                required: false,
                default: false
            },
            Car: {
                type: Boolean,
                required: false,
                default: false
            },
            Online: {
                type: Boolean,
                required: false,
                default: false
            },
            Scooter: {
                type: Boolean,
                required: false,
                default: false
            },
            Truck: {
                type: Boolean,
                required: false,
                default: false
            },
            Walk: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        languages: {
            type: Array,
            required: false
        },
        education: {
            type: Array,
            required: false
        },
        work: {
            type: Array,
            required: false
        },
        specialities: {
            type: Array,
            required: false
        }
    },
    taskAlerts: {
        alerts: {
            type: Boolean,
            required: true,
            default: true
        },
        customAlerts: [{
            alertID: {
                type: String,
                required: false
            },
            alertType: {
                inPerson: {
                    type: Boolean,
                    required: false,
                    default: false
                },
                remote: {
                    type: Boolean,
                    required: false,
                    default: false
                }
            },
            taskKeyword: {
                type: Array,
                required: false
            },
            taskName: {
                type: Array,
                required: false
            },
            taskLocation: {
                type: String,
                required: false
            },
            taskLoc: {
                type: [Number],  // [<longitude>, <latitude>]
                index: '2d',      // create the geospatial index
                required: false
            },
            taskDistance: {
                type: Number,
                required: false
            }
        }]
    },
    notifications: {
        transactional: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        taskUpdates: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        taskReminders: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        startaskerAlerts: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        taskRecommendations: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        helpfullInfo: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        updateNewsletters: {
            Email: {
                type: Boolean,
                required: false,
                default: true
            },
            Push: {
                type: Boolean,
                required: false,
                default: true
            }
        }
    }
})

module.exports = mongoose.model('Settings', CustomerSettingsSchema);