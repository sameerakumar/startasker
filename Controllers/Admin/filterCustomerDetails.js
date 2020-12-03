const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');
// const fs = require('fs');
// const Json2csvParser = require('json2csv').Parser;
const stringify = require('csv-stringify');
const generate = require('csv-generate');

var FilterCustomerDetails ={
  CustomerDetailsFilterData : (params,res,callback) =>{
    const { error } = paramValidator.validateCustomerDetailsParams(params);
    if (error) {
      return callback({ status: 400,
        data: {
          response: statusCodes.failure,
          message: error.details[0].message
        }
      });
    }
    let CustomerDetailsData = dbQueries.getCustomerDetails(params);
    CustomerDetailsData.then((foundData)=>{
      if(foundData){
       /* // -> Convert JSON to CSV data
        var fields = [{label : 'Email ID', value : (row,field) => row.userID},
                      {label : 'Full Name', value :(row,field) => row.firstName+' '+row.lastName},
                      'phoneNumber','dob',
                      { label : 'FB ID', value: (row,field) => row.Facebook.facebookID},
                    'coupons','address'];
        const opts ={fields};
        var csvFields = new Json2csvParser(opts);
        console.log("Field Type : "+csvFields);
        const csv = csvFields.parse(foundData);
        console.log("file type : "+ typeof(csv));
        var filepath = 'customer.csv';

        fs.writeFile(filepath, csv, function(err) {
          if (err) throw err;
          // else {
          //   setTimeout(function () {
          //     fs.unlinkSync('customer.csv'); // delete this file after 30 seconds
          //     console.log('It displayed after 30 seconds');
          //   }, 60000);
          // }
          console.log('file saved');
        });*/

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
            userID : 'Email ID',
            firstName : 'First Name',
			lastName :'Last Name',
			postTask :'Posted Task',
			completeTask :'completed Task',
			countryCode :'Country code',
			phoneNumber :'Contact number',
			dob :'Date of brth',
			register_time :' register Date',
			register_type :'type of register',
			address :'Address',
			city : 'City',
			state :' State',
			country :'Country',
			zipCode : 'pin code',
			region : 'Region',
			description :'descriptions',
			'Facebook.facebookID' : 'Facebook ID',
			'Google.GoogleID' :'Google ID',
			'BankAccountDetailes.Accountholdername' :'AccountName',
			'BankAccountDetailes.AccounNumber' :'Account Number',			
      coupons : 'Coupons Info',
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
module.exports = FilterCustomerDetails;