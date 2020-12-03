const Contact = require('../../app/Models/AddContacts');

var ContactDBQueries = {
    insertQuery: (params) => {        
        let contactdata = new Contact({
            userID: params.userID,
            NameoftheContactPerson: params.NameoftheContactPerson,
            contact:params.contact
        });
        return contactdata
    },
    fetchContactsByUserID:(params) =>{
        return Contact.find({userID:params.userID}).exec()
    },
    getAllQuery: (params) => {
        return Contact.find({userID:params.userID},{userID:0}).exec()
    },
    fetchContactByItsId:(params)=>{
        return Contact.findOne({_id:params._id}).exec()
    },
    updateContactQuery: (params) => {        
       return Contact.updateOne({_id: params._id},
        {
            $set : {
                NameoftheContactPerson: params.NameoftheContactPerson,
                contact:params.contact
            }
        }).exec()
    },
    deleteContactQuery: (params) => {        
        
        return Contact.deleteOne({_id: params._id}).exec()
    }
}
module.exports = ContactDBQueries;