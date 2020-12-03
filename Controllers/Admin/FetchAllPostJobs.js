const dbQueries =  require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./AdminParamvalidations');
var FetchAllPostJobs = {
    fetchjobs: (params,callback) => {
        const {error} = paramValidations.validatepagination(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }

        let getQuery = dbQueries.getAllPostJobsQuery(params);
        getQuery.then((find) =>{
            var totalPages;
            let Query = dbQueries.postjobscountQuery(params);
            Query.then((countdata) => {
                var pageNumber = parseInt(params.pageNo);
                var nPerPage = parseInt(params.size);

                 totalPages = Math.ceil(countdata / nPerPage);


            callback({ status: 200,
                data: {
                    response: statusCodes.success,
                    message: "PostJobs fetched successfully" ,
                    Postjobs: find,
                    pages:totalPages
                } });
            return;
        })
        });
    }

}

module.exports = FetchAllPostJobs;