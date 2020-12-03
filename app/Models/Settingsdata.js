const mongoose = require('mongoose');
let schema = mongoose.Schema;
var SettingsSchema = new schema({
    
    amount:{
        Setminimumtaskamount:{
            type: String,
            required: false
        },
        Setminimumwithdrawamount:{
            type: String,
            required: false
        }
    }

});
module.exports = mongoose.model('Settingsdata',SettingsSchema);