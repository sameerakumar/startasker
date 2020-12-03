const AccountVerification = require('../../app/Models/AccountVerification');
const Customers = require('../../app/Models/Customers');

var AccountVerificationData = {

    getDataQuery: (params) => {
        var query = {
            $or: [{
                userID: { $regex: '^' + params.userID + '$', $options: 'i' }
            }]
        }
        return AccountVerification.findOne(query, { _id: 0, __v: 0 }).exec()

    },
    InsertQuery: (params, filePath, filePath2) => {
        const timestamp = new Date().getTime().toString();
        let Accountdata = new AccountVerification({
            userID: params.userID,
            FullNameAsPerICPassport: params.FullNameAsPerICPassport,
            Nationality: params.Nationality,
            timestamp: timestamp,
            IDPhoto: filePath,
            profilePhoto: filePath2,
            IDType: params.IDType,
            IDNumber: params.IDNumber,
            Email: params.Email,
            DOB: params.DOB,
            Address: params.Address,
            PostCode: params.PostCode,
            City: params.City,
            State: params.State,
            CountryRegion: params.CountryRegion
        });
        return Accountdata;
    },
    UpdateQuery: (params, filePath, filePath2) => {
        const timestamp = new Date().getTime().toString();
        return AccountVerification.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    firstName: params.firstName,
                    lastName: params.lastName,
                    Nationality: params.Nationality,
                    timestamp: timestamp,
                    IDPhoto: filePath,
                    profilePhoto: filePath2,
                    IDType: params.IDType,
                    phoneNumber: params.phoneNumber,
                    Email: params.Email,
                    DOB: params.DOB,
                    Address: params.Address,
                    PostCode: params.PostCode,
                    City: params.City,
                    State: params.State,
                    CountryRegion: params.CountryRegion,
                    isVerified: 'Pending'
                }
            }).exec()
    },
    updatePaymentIDStatusQuery:(params)=>{
        return Customers.updateOne({ userID: new RegExp(params.userID, 'i') },
            {
                $set: {
                    accountVerificationStatus : 'Pending'
                }
            }).exec()
    }
}
module.exports = AccountVerificationData;