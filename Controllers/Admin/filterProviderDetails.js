const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');
const stringify = require('csv-stringify');
const generate = require('csv-generate');

var FilterProviderDetails ={
    providerDetailsfilterData : (params,res,callback) =>{
    const { error } = paramValidator.validateCustomerDetailsParams(params);
    if (error) {
      return callback({ status: 400,
        data: {
          response: statusCodes.failure,
          message: error.details[0].message
        }
      });
    }
    
    let CustomerDetailsData = dbQueries.getProviderDetails(params);
    CustomerDetailsData.then((foundData)=>{
		if(foundData){
			res.setHeader('Content-Type', 'text/csv');
			res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
			res.setHeader('Cache-Control', 'no-cache');
			res.setHeader('Pragma', 'no-cache');
      
        generate({
          objectMode: true,
          seed: 1,
          headers: 2
        })
        stringify(foundData, { header: true, 
           columns: {
            bookedTaskers : 'Email ID'
          } 
        })
        .pipe(res);
      }
      else{
        return callback({ status :200,
          data : {
            response : statusCodes.failure,
            message : "Data not found from DB"
          }
        })
      }
    }).catch((error)=>{
      console.log(error);
    })
  }
}
module.exports = FilterProviderDetails;