const Bookings = require('../Controllers/Bookings/Bookings');
var express = require('express');
var router = express.Router();
var verifyToken = require('./VerifyToken');

router.post('/taskers', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.newBookings(req.body, (result) => {
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
  router.post('/hireTasker', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.hiringTaskProvider(req.body, (result) => {
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
  router.post('/partialBooking', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.newPartialBooking(req.body, (result) => {
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
  router.post('/getBookings', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.getBookingByUserID(req.body, (result) => {
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

  router.post('/', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.getBookingsByBookingID(req.body, (result) => {
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

  router.post('/withDrawJob', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.jobWithDrawnByCustomer(req.body, (result) => {
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
  router.put('/task_completed_providers_to_customer', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.customerProvideWorkCompletedToProviders(req.body, (result) => {
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

  router.post('/request_for_fund_release', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.sentRequestForFundRelease(req.body, (result) => {
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
  router.put('/update_payment_status', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.updatePaymentStatus(req.body, (result) => {
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
  router.delete('/partialBooking', verifyToken,function (req, res, next) {
    console.log('req body...', req.body);
    if (typeof req.body === 'undefined') {
      res.json({ result: '0', message: 'no request content' });
    } else {
        Bookings.deletePartialBooking(req.body, (result) => {
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