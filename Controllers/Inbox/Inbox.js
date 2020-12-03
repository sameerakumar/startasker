const InboxController = require('./FetchingInbox');
const DeleteController = require('./DeleteNotifications');
const UpdateNotificationIsReadStatus = require('./UpdateMessageReadStatus');
var Inbox = {
    inboxFetch:(params,callback)=>{
        return InboxController.fetchInbox(params,callback);
    },
    deleteNotificationByID:(params,callback)=>{
        return DeleteController.deleteByNotifyID(params,callback);
    },
    deleteAllNotifications:(params,callback)=>{
        return DeleteController.deleteAllNotifications(params,callback);
    },
    updateIsReadStatus:(params,callback)=>{
        return UpdateNotificationIsReadStatus.updateMessageStatusByItsID(params,callback);
    }
}
module.exports = Inbox;