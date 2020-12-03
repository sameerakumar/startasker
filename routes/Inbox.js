const Inbox = require('../Controllers/Inbox/Inbox');
var express = require('express');
var router = express.Router();
var verifyToken = require('./VerifyToken');

router.post('/fetchInbox', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Inbox.inboxFetch(req.body, (result) => {
        console.log('result', result.status);
        if (result.status === 400) {
          res.statusCode = result.status;
          res.send(result.data.message);
          return;
        }
        res.json(result.data);
      });
    }
  })

  router.delete('/deleteByID', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Inbox.deleteNotificationByID(req.body, (result) => {
        console.log('result', result.status);
        if (result.status === 400) {
          res.statusCode = result.status;
          res.send(result.data.message);
          return;
        }
        res.json(result.data);
      });
    }
  })
  router.delete('/deleteAll', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Inbox.deleteAllNotifications(req.body, (result) => {
        console.log('result', result.status);
        if (result.status === 400) {
          res.statusCode = result.status;
          res.send(result.data.message);
          return;
        }
        res.json(result.data);
      });
    }
  })
  router.put('/isReadNotification', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Inbox.updateIsReadStatus(req.body, (result) => {
        console.log('result', result.status);
        if (result.status === 400) {
          res.statusCode = result.status;
          res.send(result.data.message);
          return;
        }
        res.json(result.data);
      });
    }
  })
  module.exports = router;