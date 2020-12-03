const statusCodes = require('../Core/StatusCodes');
const randomFileName = require('../Core/RandomFilename');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./CategoriesParamValidations');
const dbQueries = require('./CategoriesDBQueries');
const fs = require('fs');

var categoriesDelete = {

    delete: (params, callback) => {
        const { error } = paramValidator.validateDeleteParams(params);
        if (error) {
            callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            })
            return
        }
        const getCategoryQuery = dbQueries.getCategoryQuery(params);
        getCategoryQuery.then((found) => {
            console.log('data',found.image)
            if(found){
                fs.unlink('./public' + found.image, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                });
                const deleteQuery = dbQueries.categoryDeleteQuery(params.categoryId);
                deleteQuery.then((deleted) =>{
                    if(deleted){
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Categories has been delete successfully"
                            }
                        });
                    }else{
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.failure,
                                message: "categories delete has been failed"
                            }
                        });
                    }
                })
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No Categories found to delete"
                    }
                });
            }
        })
    }
};

module.exports = categoriesDelete;