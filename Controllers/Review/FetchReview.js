const statusCodes = require('../Core/StatusCodes');
const statusMessages = require('../Core/StatusMessages');
const paramValidator = require('./ReviewParamValidations');
const dbQueries = require('./ReviewDBQueries');

var fetchReviews = {

    fetchByUser: (params, callback) => {
        const { error } = paramValidator.validateFetchReviewsParameter(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });

        }
        
                var providersTaskCompletedPercentage;
                var posterTaskCompletedPercentage;
                var getProviderBookingQuery = dbQueries.getProviderCompletedTaskQuery(params.userID);
                getProviderBookingQuery.then((found1)=>{
                    providersTaskCompletedPercentage = getProviderJobCompletedPercentage(found1,params.userID);
                })
                var getPosterBookingsQuery = dbQueries.getPosterCompletedTaskQuery(params.userID);
                getPosterBookingsQuery.then((found2)=>{
                    posterTaskCompletedPercentage = getPosterJobCompletedPercentage(found2);
                })				
                console.log('provider percentage...',providersTaskCompletedPercentage);
				console.log('posters percentage...',posterTaskCompletedPercentage);
				let fetchReviewsQuery = dbQueries.getReviewsByUserID(params);
				fetchReviewsQuery.then((found) => {
				if (found) {
                return getAsAProviderRatings(found,providersTaskCompletedPercentage,posterTaskCompletedPercentage,callback);
                //var asAPoster = getAsAPosterRatings(found,posterTaskCompletedPercentage);
               
            } else {
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: "No reviews found with this userID"
                    }
                });
            }
        })
    }

}

function getAsAProviderRatings(found,params,params1,callback) {
    var rating5 = [];
    var rating4 = [];
    var rating3 = [];
    var rating2 = [];
    var rating1 = [];    
    var averageRatingAsAProvider = getAsAProviderAverageRatings(found);
    if(averageRatingAsAProvider ===  'NaN'){
        averageRatingAsAProvider = '0.0'
    }
    var asAProvider = {
        rating1: rating1,
        rating2: rating2,
        rating3: rating3,
        rating4: rating4,
        rating5: rating5,
        averageRatingAsAProvider : averageRatingAsAProvider,
		providerTaskCompletedDetails : params
    }
        for (var i = 0; i < found.length; i++) {            
            if (found[i].ratingsAsAProvider === undefined) {
               asAProvider;
            } else {
                if (found[i].ratingsAsAProvider === '5.0') {
                    rating5.push(found[i])
                }
                if (found[i].ratingsAsAProvider === '4.0') {
                    rating4.push(found[i])
                }
                if (found[i].ratingsAsAProvider === '3.0') {
                    rating3.push(found[i])
                }
                if (found[i].ratingsAsAProvider === '2.0') {
                    rating2.push(found[i])
                }
                if (found[i].ratingsAsAProvider === '1.0') {
                    rating1.push(found[i])
                }
            }
        }
      
    return getAsAPosterRatings(found,asAProvider,params1,callback);
}
function getAsAPosterRatings(found,asAProvider,params1,callback) {
    var rating5 = [];
    var rating4 = [];
    var rating3 = [];
    var rating2 = [];
    var rating1 = [];    
    var averageRatingAsAPoster = getAsAPosterAverageRatings(found);
    if(averageRatingAsAPoster ===  'NaN'){
        averageRatingAsAPoster = '0.0'
    }
    var asAPoster = {
        rating1: rating1,
        rating2: rating2,
        rating3: rating3,
        rating4: rating4,
        rating5: rating5,       
        averageRatingAsAPoster : averageRatingAsAPoster,
        posterTaskCompletedDetails : params1
    }
  
        for (var j = 0; j < found.length; j++) {
            if (found[j].ratingsAsAPoster === undefined) {
             asAPoster;
            } else {
                if (found[j].ratingsAsAPoster === '5.0') {
                    rating5.push(found[j])
                }
                if (found[j].ratingsAsAPoster === '4.0') {
                    rating4.push(found[j])
                }
                if (found[j].ratingsAsAPoster === '3.0') {
                    rating3.push(found[j])
                }
                if (found[j].ratingsAsAPoster === '2.0') {
                    rating2.push(found[j])
                }
                if (found[j].ratingsAsAPoster === '1.0') {
                    rating1.push(found[j])
                }
            }    
        }
        return callback({
            status: 200,
            data: {
                response: statusCodes.success,
                message: "User reviews fetched successfully",
                asAProvider: asAProvider,
                asAPoster: asAPoster

            }
        });
    
    
}

function getAsAProviderAverageRatings(found) {
    var ratings = 0;
    var count = 0;
    var totalAverageRating = 0.0;
    for (var i = 0; i < found.length; i++) {
        if (found[i].ratingsAsAProvider === undefined) {
            totalAverageRating = 0.0;
        } else {
            if (found[i].ratingsAsAProvider) {
                count = count + 1
                ratings += parseFloat(found[i].ratingsAsAProvider);
                console.log('total ratings...', ratings);
            }
        }
    }
    totalAverageRating = ratings / count;
    console.log('average..', totalAverageRating);
    return totalAverageRating.toString();
}

function getAsAPosterAverageRatings(found) {
    var ratings = 0;
    var count = 0;
    var totalAverageRating = 0.0;
    for (var i = 0; i < found.length; i++) {
        if (found[i].ratingsAsAPoster === undefined) {
            totalAverageRating = 0.0;
        } else {
            if (found[i].ratingsAsAPoster) {
                count = count + 1
                ratings += parseFloat(found[i].ratingsAsAPoster);
                console.log('total ratings...', ratings);
            }
        }
    }
    totalAverageRating = ratings / count;
    console.log('average..', totalAverageRating);
    return totalAverageRating.toString();
}

function getProviderJobCompletedPercentage(found,userID){   
        var bookingsLength = found.length;
        var TaskCompletedCount = 0;
        var taskComepltedPercentage = 0.0;
        var providersTaskCompletedPercentage = {
            completedPercentage: '0',
            TaskCompletedCount: 0
        }
        if(found.length > 0){
            for(var i=0; i<found.length; i++){
				//bookingsLength = found[i].bookedTaskers.length;
                for(j=0;j<found[i].bookedTaskers.length; j++){
                    if(found[i].bookedTaskers[j].offeredUserID === userID){
                    if(found[i].bookedTaskers[j].isTaskerCompletedTask === true){
                        TaskCompletedCount = TaskCompletedCount+1;                        
                    }
                }
                }
            }
            taskComepltedPercentage = (TaskCompletedCount/bookingsLength) * 100;
            var percentage = parseFloat(taskComepltedPercentage);           
            providersTaskCompletedPercentage.completedPercentage = percentage.toFixed();
            providersTaskCompletedPercentage.TaskCompletedCount = TaskCompletedCount;
            console.log('provider task completed average...',providersTaskCompletedPercentage);            
            return providersTaskCompletedPercentage;
        }else{
            return providersTaskCompletedPercentage;
        }    
}

function getPosterJobCompletedPercentage(found){   
        var bookingsLength = found.length;
        var TaskCompletedCount = 0;
        var taskComepltedPercentage = 0.0;  
		var posterTaskCompletedPercentage = {
            completedPercentage: '0',
            TaskCompletedCount: 0
        };
        if(found.length > 0){
            for(var i=0; i<found.length; i++){
                if(found[i].isTaskCompleted === true){
                    TaskCompletedCount = TaskCompletedCount+1;
                }
				// bookingsLength = found[i].bookedTaskers.length;
                // for(j=0;j<found[i].bookedTaskers.length; j++){                    
                //     if(found[i].bookedTaskers[j].isCustomerCompletedTask === true){
                //         TaskCompletedCount = TaskCompletedCount+1;
                //         console.log('count...',TaskCompletedCount);          
                //     }
                // }
            }
            taskComepltedPercentage = (TaskCompletedCount/bookingsLength) * 100;
            var percentage = parseFloat(taskComepltedPercentage);            
            posterTaskCompletedPercentage.completedPercentage = percentage.toFixed();
            posterTaskCompletedPercentage.TaskCompletedCount = TaskCompletedCount;
            console.log('poster task completed average...',posterTaskCompletedPercentage);
             return posterTaskCompletedPercentage;
        }else{
			return posterTaskCompletedPercentage;
		}
}
module.exports = fetchReviews;