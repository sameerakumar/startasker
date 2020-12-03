const dbQueries = require('./AdminDBQueries');
const paramValidator = require('./AdminParamvalidations');
const statusCodes = require('../Core/StatusCodes');
var moment = require('moment');

var getPostjobsData = {
  getFilterPostjobs: (params, callback) => {
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
      case  'All':
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
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
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
    let getRangeCountData = dbQueries.getPostJobsCount(startDate,endDate,opt);
    getRangeCountData.then((dataFound)=>{
      if(dataFound){
        var cNames=[];
        let getCategoryName=dbQueries.getCategoryNames();
        getCategoryName.then((findData)=>{
          if(findData){
            for(var i in findData){
              cNames.push([findData[i].categoryId]);
            }
            if(typeFilter === 'Arraytype'){
              dateRangeSortedData(dataFound,cNames,startDate,endDate);
            }
            else{
              var categoryData=[];
              for(var i=0;i<dataFound.length;i++){
                var j=parseInt(dataFound[i]._id.monthDate.substr(0,2));
                var m1Empty={};
                m1Empty=assignCategoryValues(cNames);
                for(var k=0;k<dataFound[i].postJobArr.length;k++){
                  m1Empty[dataFound[i].postJobArr[k]]++;
                }
                var m1Data={label :j,data:m1Empty};
                categoryData.push(m1Data);
              }
              return callback({
                status: 200,
                data: {
                  response: statusCodes.success,
                  message: "Data Fetched ....... ",
                  result : categoryData
                }
              });
            }
          }
          else{
            return callback({
              status: 200,
              data: {
                response: statusCodes.failure,
                message: "Data not found from DB ......",
                paramsdata : params
              }
            });
          }
        }).catch((error)=>{
          console.log(error);
        });
      }
      else{
        return callback({
          status: 200,
          data: {
            response: statusCodes.failure,
            message: "Data not Found From DB ......",
            paramsdata : params
          }
        });  
      }
    }).catch((error)=>{
      console.log(error);
    });
    function dateRangeSortedData(dataFound,cNames,startDate,endDate) {
      var categoryData=[];
      var m1Empty={};
      var startTime,endTime;
      if(startDate === endDate){
        startTime = moment(startDate + 86400000).format("MM/DD/YYYY");
        endTime = moment(endDate + 86400000).format("MM/DD/YYYY");
      }else{
        startTime = moment(startDate + 86400000).format("MM/DD/YYYY");
        endTime = moment(endDate).format("MM/DD/YYYY");
      } 
      m1Empty=assignCategoryValues(cNames);
      for(var i=0;i<dataFound.length;i++){
        //var j=parseInt(dataFound[i]._id.monthDate.substr(0,2));
        for(var k=0;k<dataFound[i].postJobArr.length;k++){
          m1Empty[dataFound[i].postJobArr[k]]++;
        }
      }
      var m1Data={label :startTime+" to "+endTime,data:m1Empty};
      categoryData.push(m1Data);
      return callback({
        status: 200,
        data: {
          response: statusCodes.success,
          message: "Data Fetched ....... ",
          result : categoryData
        }
      });
            
    }

    function assignCategoryValues(categorys) {
      var mEmpty={}
      for(var c=0;c<categorys.length;c++){
        mEmpty[categorys[c]]=0;
      }
      return mEmpty;        
    }
  }
}

module.exports = getPostjobsData;