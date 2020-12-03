var fs = require('fs');

var resultString = "";
fs.createReadStream("../../jobsSchema _v21.csv")
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
			//console.log(unix * 1000);
			//const date = unix * 1000;
			// console.log(serviceArray[0]);
			// console.log(serviceArray[1].replace("US$", ""));
			if (serviceArray.length > 1) {
				let serviceObject = {
					budget: {
						budgetType: {
							Total: true,
							HourlyRate: false
						},
						budget: parseInt(serviceArray[0]),
						Hours: serviceArray[1],
						pricePerHour: 0
					},
					numberOfWorkers: parseInt(serviceArray[2]),
					canThisTaskRemote: false,
					mustHaves: [],
					taskDates: [((new Date(serviceArray[3]).getTime() / 1000) * 1000).toString()],
					convenientTimings: [],
					attchments: [],
					jobAppliedCount: parseInt(serviceArray[4]),
					jobSelectedCount: parseInt(serviceArray[5]),
					comments: [],
					offers: [],
					postID: serviceArray[6],
					userID: serviceArray[7],
					category: {
						categoryId: serviceArray[8],
						categoryName: serviceArray[9]
					},
					postTitle: serviceArray[10].replace("$", ","),
					describeTaskInDetails: serviceArray[11].replace("$", ","),
					location: serviceArray[12].replace("$", ","),
					loc: [5.410339400000001, 100.3300133],
					post_Status: serviceArray[13]
				};
				serviceObjects.push(serviceObject);
			}
		}
		console.log('after completed...', serviceObjects);
		const postjobs = require('../../app/Models/PostJob');
		postjobs.insertMany(serviceObjects, (err, docs) => {
			if (err) {
				return console.error(err);
				console.log('error message...', err);
			} else {
				console.log('success...');
			}
		});
	});
