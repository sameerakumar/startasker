const dbQueries = require('./CustomerDBQueries');
const statusCodes = require('../Core/StatusCodes');
const GenerateID = require('../Core/ReferralCode');

var ReferEarn = {

    refer: (callback) => {

        let getCustomerQuery = dbQueries.FetchQuery();
        getCustomerQuery.then((isFound) => {
            if(isFound){
                for (var i = 0; i < isFound.length; i++) {
                    var userid = isFound[i].userID;
                    console.log('Referral Codes ...', userid);
                    let referralCode = 'ST' + GenerateID.referralCode();
                    var Query = dbQueries.getReferQuery(userid, referralCode);
                    Query.then((data) => {
                        console.log('Referral Codes saved successfully...', data);
                    })
                }
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Successfully inserted"
                    }
                });
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No data found"
                    }
                });
            }
           
        });
    }
}

module.exports = ReferEarn;