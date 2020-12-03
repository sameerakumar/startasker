const dbQueries =  require('./AddCardDBQueries');
const statusCodes = require('../Core/StatusCodes');
var FetchAddCards = {

    fetch: (callback) => {
        let getQuery = dbQueries.AddCardQuery();
        getQuery.then((find) =>{
            callback({ status: 200,
                data: {
                    response: statusCodes.success,
                    message: "AddCard fetched successfully" ,
                    AddCardList: find
                } });
            return;
        })
    }

}

module.exports = FetchAddCards;