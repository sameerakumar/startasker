var fs = require('fs');

var resultString = "";
fs.createReadStream("../../finaloffersSchema.csv")
.on("data", (data) => (resultString = resultString + data.toString()))
.on("end", () => {
var dataArray = resultString.split(/\r?\n/);
dataArray.shift();
const current_timestamp = new Date().getTime().toString();
console.log(dataArray);
var serviceObjects = [];
for (var i = 0; i < dataArray.length; i++) {
// console.log(dataArray[i]);
const serviceArray = dataArray[i].split(",");

// console.log(serviceArray[0]);
// console.log(serviceArray[1].replace("US$", ""));
if (serviceArray.length > 1) {
let serviceObject = {
postID: serviceArray[0],
offers: [{
   authorRatings: serviceArray[1],
   offeredUserID: serviceArray[2],
   authorProfilePic: serviceArray[3],
   authorMessages: [{
		 userID: serviceArray[2],
         message: "i will do this job",
         name: serviceArray[4],
         profilePic: serviceArray[3],
         timestamp: ((new Date(serviceArray[7]).getTime() / 1000) * 1000).toString()
   }],
   authorName: serviceArray[4],
   budget: parseInt(serviceArray[5]),
   isTaskerHired: JSON.parse(serviceArray[6]),
   isTaskerWithDraw: false
}]

};
const PostJob = require('../../app/Models/PostJob');
PostJob.updateOne( { postID: serviceObject.postID },
            { $push: { offers: serviceObject.offers } }, (err, docs) => {
if (err) {
return console.error(err);
console.log('error message...',err);
} else {
console.log('success...');
}
});
serviceObjects.push(serviceObject);
}

}
console.log('after completed...',serviceObjects);
console.log('final updated...');

});
