const AddCard = require('../../app/Models/AddCards');

var AddcardDBQueries = {
    getAddcardQuery: (params) => {
        var query = {
            $or: [{
                userID: {$regex: '^' + params.userID + '$', $options: 'i'}
            }
            ]
        }
        return AddCard.findOne(query, {_id: 0, __v: 0}).exec()

    },
    AddCardQuery: () => {
        return AddCard.find({}, {_id: 0, __v: 0}).exec()
    },
    insertQuery: (params) => {
        const timestamp = new Date().getTime().toString();
        let addcard = new AddCard({
            timestamp: timestamp,
            userID:params.userID,
            cards: [{
                cardNumber: params.cardNumber,
                cardholderName: params.cardholderName,
                expiryDate: params.expiryDate
            }]
        });
        return addcard
    },
    updateQuery: (params, cards) => {
        return AddCard.updateOne({userID: new RegExp(params.userID, 'i')}, {
            cards: cards
        })

    },
    deleteallQuery:(userID)=>{
        return AddCard.deleteOne({ userID: new RegExp('^' +userID + '$') }).exec()

    },
    deleteQuery:(params)=>{
    return AddCard.update(
        {"userID":params.userID},
        { $pull: { cards: { cardNumber:params.cardNumber } } },

    );

}
}

module.exports = AddcardDBQueries;