const Deals = require('../../app/Models/Deals');

var DealsData = {

    getDealQuery: (params) => {
        var query = {
            $or: [{
                userID: {$regex: '^' + params.userID + '$', $options: 'i'}
            }
            ]
        }
        return Deals.findOne(query, {_id: 0, __v: 0}).exec()

    },
    dealInsertQuery: (params, offerid, filePath) => {
     const timestamp = new Date().getTime().toString();
        let deal = new Deals({
            offerID: offerid,
            userID: params.userID,
            offerimage: filePath,
            timestamp:timestamp

        });
        return deal;
    }
}
module.exports = DealsData;