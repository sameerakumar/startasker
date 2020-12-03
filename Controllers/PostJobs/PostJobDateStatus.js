const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./PostJobsParameterValidations');
const dbQueries = require('./PostJobsDBQueries');

var dateStatus = {

    status: (params) =>{

        let fetchQuery = dbQueries.getAllPostJobsQuery(params);
        fetchQuery.then((user) => {
            //console.log("user",user);       
            for (var i = 0; i < user.length; i++ ) {                
                var arrayOfDates = user[i].taskDate;
                var postID = user[i].postID;   
                console.log('dates array length...',arrayOfDates.length);
                var res = arrayOfDates.map(v => parseInt(v, 10));
                console.log('converted integer array',res);
                var lastarrayindex=Math.max(...res);
                console.log('max timestamp from arrayindex...',lastarrayindex);
                let todayTimeStamp = new Date().getTime();
                console.log("present time",todayTimeStamp);
                if(lastarrayindex < (todayTimeStamp + 86400000)){
                    var post_Status = user[i].post_Status;
                if(post_Status === 'Open'){
                    let updateQuery = dbQueries.getUpdatePostJobQuery(postID);
                    console.log('post status updated successfully...');
                }
                }
            }
            console.log('status updated success...')

            // return callback({
            //     status: 200,
            //     data: {
            //         response: statusCodes.success,
            //         message: "Post Status is success"
            //     }
            // });
        });

    }
}

module.exports = dateStatus;