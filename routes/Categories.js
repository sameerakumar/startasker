var express = require('express');
var router = express.Router();
var Categories = require('../Controllers/Categories/Categories');
var verifyToken = require('./VerifyToken');
const fileUpload = require('express-fileupload');


router.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));


router.get('/',function(req,res,next){
             if(typeof req.body === 'undefined'){
          res.json({result:'0',message:'no request content'});
      }else{ 
        Categories.fetch((result) => {
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
router.post('/insert', function (req, res, next) {
    if (typeof req.body === 'undefined' || typeof req.files === 'undefined') {
        res.statusCode = 400;
        res.json({result: '0', message: 'no request content'});
    } else {
        Categories.insert(req.body, req.files, req.headers, req, (result) => {
            console.log('result', result.status);
            if (result.status === 400) {
                res.statusCode = result.status;
                res.send(result.data.message);
                return;
            }
            res.json(result.data);
        });
    }
});

router.put('/update', function (req, res, next) {
    if (typeof req.body === 'undefined' || typeof req.files === 'undefined') {
        res.statusCode = 400;
        res.json({result: '0', message: 'no request content'});
    } else {
        Categories.update(req.body, req.files, req.headers, req, (result) => {
            console.log('result', result.status);
            if (result.status === 400) {
                res.statusCode = result.status;
                res.send(result.data.message);
                return;
            }
            res.json(result.data);
        });
    }
});

router.delete('/delete',function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Categories.delete(req.body,(result) => {
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

router.post('/insertamountdata',function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Categories.dataamount(req.body,(result) => {
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

router.post('/updateamountdata',function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Categories.dataamountupdate(req.body,(result) => {
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