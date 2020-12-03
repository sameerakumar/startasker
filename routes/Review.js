var express = require('express');
var router = express.Router();
var Review = require('../Controllers/Review/Review');
var verifyToken = require('./VerifyToken');

router.post('/toProvider',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Review.insert(req.body,(result) => {
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

router.post('/fetch_reviews',verifyToken,function(req,res,next){
    console.log('req body...',req.body);
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Review.fetchReviews(req.body,(result) => {
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

router.post('/toPoster',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Review.ratingToCustomer(req.body,(result) => {
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