const DealsInsert = require('./InsertDeal');

var DealsList = {

    insert: (params, file, headers, req, callback) => {
        return DealsInsert.file(params, file, headers, req, callback);
    }
}
module.exports = DealsList;