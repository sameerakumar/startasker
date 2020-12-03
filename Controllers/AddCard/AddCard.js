const AddCardInsert = require('./InsertAddCard');
const FetchAddCard = require('./FetchAddCard');
const DeleteAddCard = require('./DeleteAddCard');
const DeleteAllAddCard = require('./DeleteAllCards');

var Addcard = {

    insert: (params, callback) => {
        return AddCardInsert.card(params, callback);
    },
    fetch: (callback) =>{
        return FetchAddCard.fetch(callback);
    },
    delete: (params, callback) =>{
        return DeleteAddCard.delete(params, callback);
    },
    deletecard: (params, callback) =>{
        return DeleteAllAddCard.deletecard(params, callback);
    }
};
module.exports = Addcard;