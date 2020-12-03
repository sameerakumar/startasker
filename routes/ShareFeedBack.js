var express = require('express');
var router = express.Router();
var ShareFeedBack = require('../Controllers/ShareFeedback/ShareFeedback');
var verifyToken = require('./VerifyToken');

router.post('/feedback',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        ShareFeedBack.shareFeedBack(req.body,(result) => {
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

module.exports=router;