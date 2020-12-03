const AccountVerificationInsert = require('./InsertAccountVerification');
const AccountVerificationUpdate = require('./UpdateAccountVerification');
const FetchAccountData = require('./FetchAccountVerfication');
var accountVerificationList = {

    insert: (params, file, headers, req, callback) => {
        return AccountVerificationInsert.file(params, file, headers, req, callback);
    },
    update: (params, profilepic, headers, req, callback) => {
        return AccountVerificationUpdate.updatefile(params, profilepic, headers, req, callback);
    },
    fetchAccount: (params,callback) =>{
        return FetchAccountData.fetch(params,callback);
    }
}
module.exports = accountVerificationList;
