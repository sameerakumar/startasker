const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');

var StatusDashboardDetails ={
  getStatusDashboard:(params,callback) =>{
    var results =[];
    let getCustomersTotal = dbQueries.getTotalCustomers(params);
    getCustomersTotal.then((result)=>{
      if(result){
        var customersDb={};
        if(result[0].TotalUsers){
          customersDb["TotalUsers"] = result[0].TotalUsers;
        }else{
          customersDb["TotalUsers"] =0;
        }
        if(result[0].PendingVerification){
          customersDb["PendingVerification"] = result[0].PendingVerification;
        }else{
          customersDb["PendingVerification"] =0;
        }
        if(result[0].RejectedVerification){
          customersDb["RejectedVerification"] = result[0].RejectedVerification;
        }else{
          customersDb["RejectedVerification"] =0;
        }
        results.push(customersDb);

        let getCustomerThisMonth = dbQueries.getThisMonthCustomer(params);
        getCustomerThisMonth.then((foundDB)=>{
          if(foundDB){
            if(foundDB.length === 0){
              results.push({"NewCustomersThisMonth":0});
              }else{
              results.push({"NewCustomersThisMonth":foundDB[0].TotalCount});
              }
            let getTaskDetails =dbQueries.TaskDetailsStatus(params);
            getTaskDetails.then((TaskData)=>{
              TasksInfo ={};
              for(var i=0;i<TaskData.length;i++){
                for(var j=0;j<TaskData[i].TaskInfo.length;j++){
                  switch(TaskData[i].TaskInfo[j]._id){
                    case 'Open':
                      TasksInfo["TaskOpenCount"] =TaskData[i].TaskInfo[j].count;
                    break;
                    case 'Assigned':
                      TasksInfo["TaskAssignedCount"] =TaskData[i].TaskInfo[j].count;
                    break;
                    case 'Cancel':
                      TasksInfo["TaskCancelCount"] =TaskData[i].TaskInfo[j].count;
                    break;
                    case 'Expired':
                      TasksInfo["TaskexpiredCount"] =TaskData[i].TaskInfo[j].count;
                    break;
                  }
                }
              }
              results.push(TasksInfo);
              let bookingsPayments = dbQueries.getBookingsPayments(params);
              bookingsPayments.then((findPayments)=>{
                if(findPayments){
                  var bookingsDb={};
                  if(findPayments[0].TotalBookings){
                    bookingsDb["TotalBookings"] = findPayments[0].TotalBookings;
                  }
                  else{
                    bookingsDb["TotalBookings"] =0;
                  }
                  if(findPayments[0].PaymentComplete){
                    bookingsDb["PaymentComplete"] = findPayments[0].PaymentComplete;
                  }else{
                    bookingsDb["PaymentComplete"] =0;
                  }
                  if(findPayments[0].PaymentPending){
                    bookingsDb["PaymentPending"] = findPayments[0].PaymentPending;
                  }else{
                    bookingsDb["PaymentPending"] =0;
                  }
                  if(findPayments[0].JobsWithdrawal){
                    bookingsDb["JobsWithdrawal"] = findPayments[0].JobsWithdrawal;
                  }else{
                    bookingsDb["JobsWithdrawal"] = 0;
                  }
                  results.push(bookingsDb);
                  return callback({ status :200,
                    data : {
                      response : statusCodes.success,
                      message : "Data  fetched",
                      results :results
                    }
                  })          
                }
                else{
                  return callback({ status :200,
                    data : {
                      response : statusCodes.failure,
                      message : "Data not fetched"
                    }
                  })                  
                }             
              }).catch((error)=>{
                console.log(error);
              });    
            }).catch((error)=>{
              console.log(error);
            });
          }
          else{
            return callback({ status :200,
              data : {
                response : statusCodes.failure,
                message : "Data not fetched"
              }
            })
          }
        }).catch((error)=>{
          console.log(error);
        });
      }else{
        return callback({ status :200,
          data : {
            response : statusCodes.failure,
            message : "Data not fetched"
          }
        })
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
}

module.exports=StatusDashboardDetails;