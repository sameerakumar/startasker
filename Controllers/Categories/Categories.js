const Categories = require('./FetchingCategories');
const CategoriesInsert = require('./InsertCategories') ;
const CategoriesUpdate =require('./UpdateCategories');
const CategoriesDelete = require('./DeleteCategories');
const Insertdata = require('./InsertSettingsdata');
const Updatedata = require('./Updatesettingsdata');

var fetchCategoriesList = {

    fetch: (callback) =>{
        return Categories.fetch(callback);
    },
    insert: (params, file, headers, req, callback) =>{
        return CategoriesInsert.file(params, file, headers, req, callback);
    },
    update: (params, file, headers, req, callback) =>{
        return CategoriesUpdate.update(params, file, headers, req, callback);
    },
    delete: (params, callback) =>{
        return CategoriesDelete.delete(params, callback);
    },
    dataamount: (params, callback) =>{
        return Insertdata.amountdata(params, callback);
    },
    dataamountupdate: (params, callback) =>{
        return Updatedata.updateamountdata(params, callback);
    }
}

module.exports = fetchCategoriesList;