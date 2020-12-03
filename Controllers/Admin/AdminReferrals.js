const dbQueries =  require('./AdminDBQueries');
const statusCodes = require('../Core/StatusCodes');
const paramValidations = require('./AdminParamvalidations');

var filterReferral = {
    referral: (params,callback) => {
        const {error} = paramValidations.validatereferralParams(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        var chkFromDate = params.hasOwnProperty('fromdate');
        var chkToDate = params.hasOwnProperty('todate');
        console.log("check",chkFromDate && chkToDate)
        if(chkFromDate && chkToDate) {
            let getReferralsQuery = dbQueries.findreferralQuery(params,true);
            getReferralsQuery.then((found,err)=> {
                console.log("found", err)
                if (found.length>0 || found === 'undefined') {
                    let referraldata = dbQueries.referralcountQuery(params,true);
                    referraldata.then((countdata) => {
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size);

                        var totalPages = Math.ceil(countdata / nPerPage);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Referral fetched successfully",
                                FetchData: found,
                                pages: totalPages
                            }
                        });
                    });

                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Referral fetched successfully",
                            FetchData: [],
                            pages: 0
                        }
                    });
                }
            });
        }else{
            let fetchQuery = dbQueries.findreferralQuery(params,false);
            fetchQuery.then((found) => {
                console.log("found", found)
                if (found.length>0) {
                    let referraldata = dbQueries.referralcountQuery(params,false);
                    referraldata.then((countdata) => {
                        var pageNumber = parseInt(params.pageNo);
                        var nPerPage = parseInt(params.size);

                        var totalPages = Math.ceil(countdata / nPerPage);
                        return callback({
                            status: 200,
                            data: {
                                response: statusCodes.success,
                                message: "Referral fetched successfully",
                                FetchData: found,
                                pages: totalPages
                            }
                        });
                    });
                } else {
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: "Referral fetched successfully",
                            FetchData: [],
                            pages: 0
                        }
                    });
                }
            });
        }
    }
};

module.exports = filterReferral;