var express = require('express');
var router = express.Router();
var Deals = require('../Controllers/Deals/Deals');
var verifyToken = require('./VerifyToken');
const fileUpload = require('express-fileupload');


router.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));

router.post('/insert', function (req, res, next) {
    if (typeof req.body === 'undefined' || typeof req.files === 'undefined') {
        res.statusCode = 400;
        res.json({result: '0', message: 'no request content'});
    } else {
        Deals.insert(req.body, req.files, req.headers, req, (result) => {
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