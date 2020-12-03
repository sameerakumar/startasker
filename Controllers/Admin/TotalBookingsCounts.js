const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');
var moment = require('moment');

var getBookingsData = {
  getTotalBookingCounts: (params, callback) => {
    const { error } = paramValidator.validateTotalBookingsParams(params);
    if (error) {
      return callback({
        status: 400,
        data: {
          response: statusCodes.failure,
          message: error.details[0].message
        }
      });
    }
    var startDate;
    var endDate;
    var opt;
    var strget =JSON.stringify(params);
    var strJson = JSON.parse(strget);
    var typeFilter=strJson.getTypeFilter;
    var diffDays;
    if(typeFilter[0]=== '['){
      typeFilter="Arraytype"
    }
    switch(typeFilter){
      case "thisMonth" :
        var dt = new Date();
        
        var y = dt.getFullYear(); 
        var m = dt.getMonth();
        startDate = new Date(Date.UTC(y,m,1,0,0,0));
        
        stDate = moment([y, m]);
        endDate =new Date(moment(stDate).endOf('month'));
        
        opt='m';
      break;
      case "thisWeek":
        const today = moment();
        var stDate = today.startOf('week');
        startDate= new Date(stDate);
        var eDate=today.endOf('week');
        endDate=new Date(eDate);
        opt='m';
      break;
      case "thisYear":
        var dt = new Date();
        var y = dt.getFullYear();
        var stYear = Date.UTC(y,0,1,0,0,0);
        var endYear =Date.UTC(y,11,30,23,59,59);
        startDate= new Date(stYear);
        endDate=new Date(endYear);
        opt='y';
      break;
      case "All":
        opt="all";
        startDate=null;
        endDate=null;
      break;
      case "Arraytype":
        var a=strJson.getTypeFilter;
        var str=a.substr(1,(a.length)-2);
        var ar = str.split(',');
        startDate = ar[0];
        endDate = ar[1];
        var dateFirst;
        var dateSecond;
        if(ar[0].length === 10 && ar[1].length === 10){
          dateFirst  = new Date(startDate*1000);
          dateSecond = new Date(endDate*1000);
        }
        else{
          var ab=startDate/1000;
          var b=endDate/1000;
          dateFirst  = new Date(ab*1000);
          dateSecond = new Date(b*1000);
        }
        // time difference
        var timeDiff = Math.abs(dateSecond.getTime() - dateFirst.getTime());

        // days difference
        diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if(diffDays<=31){
          startDate=dateFirst;
          endDate=dateSecond;
          opt='m'
        }
        else{
          startDate=dateFirst;
          endDate=dateSecond;
          opt='y'
        }
        
      break;
      default :
      return callback({
        status: 400,
        data: {
          response: statusCodes.failure,
          message: "pass correct input parameters ",
        }
      });
    }
    var results = {data :[],label:"empty"};
    let getRangeCountData = dbQueries.getRangeBookingCount(startDate,endDate,opt);
    getRangeCountData.then((dataFound)=>{
      if(dataFound){
        if(opt === 'all'){
          opt='y';
        }
        if(typeFilter === 'Arraytype'){
          opt='r';
        }        
        switch(opt){
          case 'y':
            monthWiseDataSorted(dataFound,results,typeFilter);
          break;
          case 'm':
            dayWiseDataSorted(dataFound,results,typeFilter);
          break;
          case 'r':
            dateRangeDataSorted(dataFound,diffDays);
          break;
          default:
            return callback({
              status: 400,
              data: {
                response: statusCodes.failure,
                message: "can't find out which is sorted type day or month",
              }
            });
        }
      }
      else{
        return callback({
          status: 200,
          data: {
            response: statusCodes.failure,
            message: "Data not found from DB...",
            paramsdata : params
          }
        });
  
      }

    }).catch((error)=>{
      console.log(error);
    });

    function monthWiseDataSorted(dataFound,results,typeFilter) {
      var totalMonths={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0};
      var totalMonthsValues=[];
      for(var i=0;i<dataFound.length;i++){
        totalMonths[parseInt(dataFound[i]._id.substr(0,2))]=dataFound[i].count;
      }
      for(var i=1;i<=12;i++){
        totalMonthsValues.push(totalMonths[i]);
      }
      results.data=totalMonthsValues;
      console.log("mmmmm wise");
      results.label=typeFilter;
      return callback({
        status: 200,
        data: {
          response: statusCodes.success,
          message: "Data Fetched ",
          result : results
        }
      }); 
    }
    function dayWiseDataSorted(dataFound,results,typeFilter){
      var totalMonthsValues=[];
      if(typeFilter === 'thisWeek'){
        for(var i=0;i<dataFound.length;i++){
          totalMonthsValues.push(dataFound[i].count);
        }
        for(var j=dataFound.length;j<7;j++){
          totalMonthsValues[j]=0;
        }
        results.data=totalMonthsValues;
        results.label=typeFilter;
        return callback({
          status: 200,
          data: {
            response: statusCodes.success,
            message: "Data Fetched",
            result : results
          }
        }); 
      }
      if(typeFilter === 'thisMonth'){
        var totalDays={};
        for(var i=1;i<=31;i++){
          totalDays[i]=0;
        }
        for(var i=0;i<dataFound.length;i++){
          totalDays[parseInt(dataFound[i]._id.substr(3,2))]=dataFound[i].count;
        }
        for(var i=1;i<=31;i++){
          totalMonthsValues.push(totalDays[i]);
        }
        results.data=totalMonthsValues;
        results.label=typeFilter;
      }    
      results.data=totalMonthsValues;
      results.label=typeFilter;
      return callback({
        status: 200,
        data: {
          response: statusCodes.success,
          message: "Data Fetched ",
          result : results
        }
      }); 
    }

    function dateRangeDataSorted(dataFound,diffDays) {
      var totDaysZero={};
      var totalDays ={};
      var results = {data :[],label:"DateRange"};
      if(diffDays<=31){
        for(var i=0;i<dataFound.length;i++){
          totalDays[dataFound[i]._id.substr(0,5)]=dataFound[i].count;
          console.log("d  "+dataFound[i]._id.substr(0,5));
        }
      }
      else {
        for(var i=0;i<dataFound.length;i++){
          var m=dataFound[i]._id.substr(0,2);
          var y=dataFound[i]._id.substr(3,4);
          totalDays[m+'/'+y]=dataFound[i].count;
        }        
      }
      results.data.push(totalDays);    
      return callback({
        status: 200,
        data: {
          response: statusCodes.success,
          message: "Data Fetched ",
          result : results
        }
      }); 
    }


  }
}

module.exports = getBookingsData;