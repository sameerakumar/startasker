const mongoose = require('mongoose');
let schema = mongoose.Schema;
var DealSchema = new schema({
  userID:{
      required:true,
      type:String
  },
    offerID: {
        required: true,
        type: String,
        unique: true
    },
   offerimage:{
        required:true,
       type:String
   },
    timestamp: {
        type: String,
        required: true
    }

});
module.exports = mongoose.model('Deal',DealSchema);