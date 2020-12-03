var express = require('express');
var router = express.Router();
var Provider = require('../Controllers/Provider/Provider');
var verifyToken = require('./VerifyToken');

router.post('/add_region',verifyToken,function(req,res,next){
    console.log('request body...',req.body);
      if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{ 
        Provider.addRegion(req.body,(result) => {
         console.log('result',result.status);
           if(result.status === 400) {
            res.statusCode = result.status;
            res.send(result.data.message);
            return;
           }
            res.json(result.data);
        });
    }
    });
    
    router.post('/fetch_region',verifyToken,function(req,res,next){
      console.log('request body...',req.body);
        if(typeof req.body === 'undefined'){
          res.json({result:'0',message:'no request content'});
      }else{ 
          Provider.fetchRegions(req.body,(result) => {
           console.log('result',result.status);
             if(result.status === 400) {
              res.statusCode = result.status;
              res.send(result.data.message);
              return;
             }
              res.json(result.data);
          });
      }
      }); 

      router.put('/update_region',verifyToken,function(req,res,next){
        console.log('request body...',req.body);
          if(typeof req.body === 'undefined'){
            res.json({result:'0',message:'no request content'});
        }else{ 
            Provider.updateRegionStatus(req.body,(result) => {
             console.log('result',result.status);
               if(result.status === 400) {
                res.statusCode = result.status;
                res.send(result.data.message);
                return;
               }
                res.json(result.data);
            });
        }
        }); 

        router.delete('/delete_region',verifyToken,function(req,res,next){
          console.log('request body...',req.body);
            if(typeof req.body === 'undefined'){
              res.json({result:'0',message:'no request content'});
          }else{ 
              Provider.deleteRegion(req.body,(result) => {
               console.log('result',result.status);
                 if(result.status === 400) {
                  res.statusCode = result.status;
                  res.send(result.data.message);
                  return;
                 }
                  res.json(result.data);
              });
          }
          }); 

          router.delete('/delete_all_region',verifyToken,function(req,res,next){
            console.log('request body...',req.body);
              if(typeof req.body === 'undefined'){
                res.json({result:'0',message:'no request content'});
            }else{ 
                Provider.deleteAllRegions(req.body,(result) => {
                 console.log('result',result.status);
                   if(result.status === 400) {
                    res.statusCode = result.status;
                    res.send(result.data.message);
                    return;
                   }
                    res.json(result.data);
                });
            }
            }); 
module.exports = router;