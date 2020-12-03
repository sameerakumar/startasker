var express = require('express');
var router = express.Router();
var FeedBack = require('../Controllers/FeedBack/FeedBack');


router.post('/insert',function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        FeedBack.feedback(req.body,(result) => {
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