const randomFileName = require('../Core/RandomFilename');
var dbQueries = require('./CustomerDBQueries');
const cc = require('coupon-code');
var fs = require('fs');
var bcrypt = require('bcryptjs');


var resultString = "";
fs.createReadStream("../../customers.csv")
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
            //const serviceID = "SID" + (i + 1).toString();
            // console.log(serviceArray[0]);
            // console.log(serviceArray[1].replace("US$", ""));
            if (serviceArray.length > 1) {
                var readStream = fs.createReadStream('../../user.png');
                let imageName = randomFileName.getFileName1() + '.jpg';
                let imagepath = "../../public/images/Customers/" + imageName;
                readStream.pipe(fs.createWriteStream(imagepath));
                let randomPassword = randomFileName.getPasswordForOldCustomers();
                let hashedPassword = bcrypt.hashSync(randomPassword, 8);
                let serviceObject = {
                    firstName: serviceArray[0],
                    lastName: serviceArray[1],
                    userID: serviceArray[2],
                    address: serviceArray[3].replace("$", ","),
                    phoneNumber: serviceArray[4],
                    register_time: current_timestamp,
                    profilePic: '/images/Customers/' + imageName,
                    register_type: "Manual",
                    otp: "1234",
                    password: hashedPassword,
                    isActive: true,
                    aboutMe: "",
                    isProfileUpdate: true,
                    completeTask: true,
                    postTask: true,
                    isGivenAppRatings: false,
                    verification_status: true,
                    loc: [5.410339400000001, 100.3300133],
                    isOldUser: true,
                    search_Configurations: {
                        lat: "5.410339400000001",
                        long: "100.3300133",
                        radius: "5000",
                        maxPrice: "9999",
                        minPrice: "5",
                        taskTypes: "All",
                        hideAssignedTask: false,
                        locationName: serviceArray[6].replace("$", ",")
                    }
                    
                };
                let insertQuery = dbQueries.insertCustomerQuery(serviceArray[2]);
                insertQuery.save((success) => {
                    console.log('suceess', success);
                })
                let insertInboxQuery = dbQueries.insertUserInboxQuery(serviceArray[2]);
                insertInboxQuery.save((success) => {
                    console.log('success', success);
                })
                let insertAccountQuery = dbQueries.insertUserAccountVerification(serviceArray[2]);
                insertAccountQuery.save((success) => {
                    console.log('success', success);
                })
                
                serviceObjects.push(serviceObject);
                
            }
        }
        console.log(serviceObjects);
        const Customers = require('../../app/Models/Customers');
        Customers.insertMany(serviceObjects, (err, docs) => {
        if (err) {
        return console.error(err);
        
        } else {
            return afterUsersInserted(serviceObjects);
        }
        });
    });

    function afterUsersInserted(userList){
        for(var k=0;k<userList.length;k++){
            var userID = userList[k].userID;
            for (var j = 0; j < 5; j++) {
                var code = cc.generate({ parts: 1 })
                var couponCode = 'STH-' + code + '005';
                var insertCoupons = dbQueries.insertCouponsToNewUsersQuery(userID, couponCode);
                insertCoupons.then((saved) => {
                    console.log('saved coupons successfully...', saved);
                })
            }
        }
        console.log('completed...');
    }