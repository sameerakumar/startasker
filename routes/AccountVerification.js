var express = require('express');
var router = express.Router();
var Account = require('../Controllers/AccountVerification/AccountVerification');
var verifyToken = require('./VerifyToken');
const fileUpload = require('express-fileupload');


router.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));

router.post('/', verifyToken,function (req, res, next) {
    if (typeof req.body === 'undefined' || typeof req.files === 'undefined') {
        res.statusCode = 400;
        res.json({result: '0', message: 'no request content'});
    } else {
        let requiredData = JSON.parse(req.body.verificationData);
        //console.log(requiredData);
        Account.insert(requiredData, req.files, req.headers, req, (result) => {
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

router.post('/update', function (req, res, next) {
    if (typeof req.body === 'undefined' || typeof req.files === 'undefined') {
        res.statusCode = 400;
        res.json({result: '0', message: 'no request content'});
    } else {
        Account.update(req.body, req.files, req.headers, req, (result) => {
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

router.post('/get', function (req, res, next) {
    if (typeof req.body === 'undefined') {
        res.statusCode = 400;
        res.json({result: '0', message: 'no request content'});
    } else {
        Account.fetchAccount(req.body, (result) => {
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

module.exports = router;