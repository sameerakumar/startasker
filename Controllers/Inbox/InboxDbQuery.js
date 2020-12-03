const Inbox = require('../../app/Models/NotificationsInbox');

var InboxDbQuery = {
    getCustomerInboxQuery:(params) => {  
        return Inbox.aggregate([
            // Initial document match (uses index, if a suitable one is available)
            { $match: {
                userID : new RegExp(params.userID, 'i')
            }},
            { $unwind: '$notifyInbox' },
            // Sort in descending order
            { $sort: {
                'notifyInbox.timeStamp': -1
            }},
            {
                "$group": { 
                    "notifyInbox": {
                        "$push": "$notifyInbox"
                    },
                    _id: 1              
                },
            }, {
                "$project": {
                    "_id": 0,
                    "userID" : 1,
                    "notifyInbox": 1
                }
            }
        ]).exec()
        // return Inbox.find({ userID: new RegExp(params.userID, 'i') },{_id:0,__v:0},
        // ).exec()
    },
    deleteNotificationByItsIDQuery:(params)=>{
        return Inbox.updateOne({userID: new RegExp(params.userID, 'i'),"notifyInbox.notifyID":params.notifyID},
        {
            $pull :{
                notifyInbox : {
                    notifyID : params.notifyID
                }
            }
        }).exec()
    },
    deleteAllNotificationQuery:(params)=>{
        return Inbox.updateOne({userID: new RegExp(params.userID, 'i')},
        {           
                notifyInbox : []
            
        }).exec()
    },
    getNotificationByItsID:(params) =>{
        return Inbox.findOne({userID: params.userID,"notifyInbox.notifyID": params.notifyID},
        {_id:0, "notifyInbox.$":1}).exec()
    },
    updateNotificationReadStatusByItsIDQuery:(params)=>{
        return Inbox.updateOne({userID: new RegExp(params.userID, 'i'),"notifyInbox.notifyID":params.notifyID},
        {
            $set :{ "notifyInbox.$.isRead" : true
            }
        }).exec()
    }
}

module.exports = InboxDbQuery;