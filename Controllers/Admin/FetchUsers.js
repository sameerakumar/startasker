const dbQueries =  require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./AdminParamvalidations');

var Fetchusers = {

    fetchingdata: (params,callback) => {
        const { error } = paramValidations.validatedParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        if (params.type === 'All') {
            let getQuery = dbQueries.FetchUsersQuery();
            getQuery.then((find) => {
              //  console.log("find",find);
                callback({
                    status: 200,
                    data: {
                        response: statusCodes.success,
                        message: "All Users fetched successfully",
                        Users: find
                    }
                });
                return;
            })

        }else if(params.type === 'Poster') {
            let fetchQuery = dbQueries.FetchUsersQuery(params);
            fetchQuery.then((ifFound) => {

                for (var i = 0; i < ifFound.length; i++) {
                    var isFound = ifFound[i].postTask;
                }
                    if (isFound = true) {
                        let getQuery = dbQueries.FetchpostersQuery(params);
                        getQuery.then((find) => {
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: " posters fetched successfully",
                                    Posters: find
                                }
                            });
                        });
                    }

                });


        }else if (params.type === "Tasker"){

            let fetchQuery = dbQueries.FetchUsersQuery(params);
            fetchQuery.then((ifFound) => {
                for (var i = 0; i < ifFound.length; i++) {
                    var isFound = ifFound[i].completeTask;
                }
                    if (isFound = true) {
                        let getQuery = dbQueries.FetchtaskersQuery(params);
                        getQuery.then((find) => {
                            return callback({
                                status: 200,
                                data: {
                                    response: statusCodes.success,
                                    message: " Taskers fetched successfully",
                                    Taskers: find
                                }
                            });
                        });
                    }

            });
    }
    else{
            return callback({
                status: 200,
                data: {
                    response: statusCodes.success,
                    message: " no data found"
                }
            });
        }
  }

};

module.exports = Fetchusers;