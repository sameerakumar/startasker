const paramValidations = require('./CustomerParamsValidation');
const dbQueries = require('./CustomerDBQueries');
const statusCodes = require('../Core/StatusCodes');

var FetchCustomerReferralUsersAndEarningsList = {

    fetchReferralUsersEarning: (params,callback) =>{
        const { error } = paramValidations.validateReferralCode(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let FetchReferralQuery = dbQueries.fetchUserByReferralCode(params);
        FetchReferralQuery.then((found)=>{
            if(found){
                console.log('found refferal code...')
                let FetchReferralUsers = dbQueries.fetchRefferalUsersQuery(params);
                FetchReferralUsers.then((FoundReferrals)=>{
                    console.log('found referral users...',FoundReferrals);
                    let FetchCustomerEarningsQuery = dbQueries.fetchReferralEarnings(params);
                    FetchCustomerEarningsQuery.then((foundEarnings)=>{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Data fetched successfully",
                                referralUsers: FoundReferrals,
                                earningsData: foundEarnings
                            }
                        });   
                    })
                })

            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "Data not found with provided referralcode"
                    }
                });  
            }
        })
    }

}

module.exports = FetchCustomerReferralUsersAndEarningsList;