const ContactInsert = require('./InsertAddContacts');
const FetchContact = require('./FetchEmerhencyContact');
const UpdateContact = require('./UpdateEmergencyContact');
const DeleteContact = require('./DeleteEmergencyContact');

var Contact = {
    insert: (params, callback) => {
        return ContactInsert.contact(params, callback);
    },
    fetchContact:(params,callback)=>{
        return FetchContact.fetch(params,callback);
    },
    updateContact:(params,callback)=>{
        return UpdateContact.update(params,callback);
    },
    deleteContact:(params,callback)=>{
        return DeleteContact.delete(params,callback);
    }
}
module.exports = Contact;