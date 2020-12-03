const mongoose = require('mongoose');
let schema = mongoose.Schema;
var ContactSchema = new schema({
userID:{
    required: true,
    type: String
},
    NameoftheContactPerson: {
        required: true,
        type: String
    },
   contact: {

       countryCode: {
           required: false,
           type: String
       },
       phoneNumber: {
           required: false,
           type: String
       }
   }
});
module.exports = mongoose.model('Contacts',ContactSchema);