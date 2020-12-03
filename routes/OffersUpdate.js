var express = require('express');
var router = express.Router();
var PostJobs = require('../Controllers/PostJobs/PostJobs');
var verifyToken = require('./VerifyToken');

router.put('/update_offer', verifyToken, function (req, res, next) {
    console.log(' update_Offers...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
      PostJobs.offerUpdate(req.body, (result) => {
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

  router.delete('/delete_offer', verifyToken, function (req, res, next) {
    console.log(' update_Offers...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
      PostJobs.offerCancel(req.body, (result) => {
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

  router.post('/getOfferedPosts', verifyToken, function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
      PostJobs.getOfferedPosts(req.body, (result) => {
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