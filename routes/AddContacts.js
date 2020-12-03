var express = require('express');
var router = express.Router();
var Contact = require('../Controllers/AddContacts/AddContacts');
var verifyToken = require('./VerifyToken');

router.post('/addNewContact',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Contact.insert(req.body,(result) => {
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

router.put('/updateContact',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Contact.updateContact(req.body,(result) => {
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

router.delete('/deleteContact',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Contact.deleteContact(req.body,(result) => {
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

router.post('/fetchContact',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{
        Contact.fetchContact(req.body,(result) => {
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