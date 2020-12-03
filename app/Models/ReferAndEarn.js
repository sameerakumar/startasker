const mongoose = require("mongoose");
let schema = mongoose.Schema;
var referralEarningSchema = new schema({
  referralCode : { type: String, required: true },
  referByUserID : { type: String, required: true },
  referToUserID : { type: String, required: true },
  taskTitle:{ type: String, required: true },
  postID : { type: String, required: true},
  bookingID : { type: String, required: true},
  isTaskar : { type: Boolean, required: true },
  bookingAmount :  { type: Number, required: true },
  earningTimeStamp: { type: String, required: true},
  earningDate : { type: String, required: true },
  earnAmount : { type: Number, required: true },
  transferDate : { type: String, required: false },
  isTransferStatus : { type: Boolean, required: false,default: false },    
});

module.exports = mongoose.model("referralearning", referralEarningSchema);