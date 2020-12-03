const dbQueries =  require('./CategoriesDBQueries');
const statusCodes = require('../Core/StatusCodes');
var FetchCategories = {
   
    fetch: (callback) => {
        let getQuery = dbQueries.getCategoriesQuery();
        getQuery.then((find) => {
            let updateQuery = dbQueries.getSettingsamountdataQuery();
            updateQuery.then((isUpdate) => {
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "Categories fetched successfully",
                        categoriesList: find,isUpdate
                    }
                });
                return;
            })
        })
    }

}

module.exports = FetchCategories;