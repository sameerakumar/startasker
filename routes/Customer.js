var express = require('express');
var router = express.Router();
var verifyToken = require('./VerifyToken');
const fileUpload = require('express-fileupload');
var Customer = require('../Controllers/Customers/Customers');

router.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

router.post('/register', function (req, res, next) {
  console.log('req body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.registration(req.body, (result) => {
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
router.post('/verify', function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.verify(req.body, (result) => {
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

router.post('/login', function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.login(req.body, (result) => {
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

router.post('/forgot', function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.forgotpassword(req.body, (result) => {
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

router.put('/reset_password', function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.reset(req.body, (result) => {
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

router.put('/', verifyToken, function (req, res, next) {
  if (typeof req.body === 'undefined') {
    res.statusCode = 400;
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.update(req.body, req.files, req.headers, req, (result) => {
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

router.get('/:userName', function (req, res, next) {
  console.log('request body...', req.params.userName);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.checkUserNameAvailablity(req.params, (result) => {
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

router.delete('/account', verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.deleteAccount(req.body, (result) => {
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

router.post('/social_media', function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.social_media(req.body, (result) => {
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

router.post('/fetch', function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.fetch(req.body, (result) => {
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

router.put('/settings/skill_update',verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.updateSkills(req.body, (result) => {
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

router.put('/settings/taskalert_update',verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.updateAlerts(req.body, (result) => {
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

router.put('/settings/notifications_update',verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.updateCustomerNotifications(req.body, (result) => {
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

router.post('/settings/add_custom_alerts',verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.addCustomAlerts(req.body, (result) => {
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

router.put('/settings/update_custom_alerts',verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.updateCustomAlerts(req.body, (result) => {
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

router.delete('/settings/delete_custom_alerts',verifyToken, function (req, res, next) {
  console.log('request body...', req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.deleteCustomAlert(req.body, (result) => {
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

router.put('/changepassword',verifyToken,function(req,res,next){
  console.log('request body...',req.body);
    if(typeof req.body === 'undefined'){
      res.json({result:'0',message:'no request content'});
  }else{ 
    Customer.changePassword(req.body,(result) => {
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

  router.post('/task',function(req,res,next){
    console.log('request body...',req.body);
      if(typeof req.body === 'undefined'){
        res.json({result:'0',message:'no request content'});
    }else{ 
      Customer.updateSearchConfig(req.body,(result) => {
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

    router.put('/update',verifyToken,function(req,res,next){
      if(typeof req.body === 'undefined'){
          res.statusCode = 400;
          res.json({result:'0',message:'no request content'});
      }else{
          Customer.dataupdate(req.body,req.files,req.headers,req,(result) => {
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
  
  router.put('/updateaccount',verifyToken,function(req,res,next){
      if(typeof req.body === 'undefined'){
          res.statusCode = 400;
          res.json({result:'0',message:'no request content'});
      }else{
          Customer.updateaccount(req.body,(result) => {
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
  
  router.put('/updateaddress',verifyToken,function(req,res,next){
      if(typeof req.body === 'undefined'){
          res.statusCode = 400;
          res.json({result:'0',message:'no request content'});
      }else{
          Customer.updateaddress(req.body,(result) => {
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
  
  router.put('/updatedob',verifyToken,function(req,res,next){
      if(typeof req.body === 'undefined'){
          res.statusCode = 400;
          res.json({result:'0',message:'no request content'});
      }else{
          Customer.updatedob(req.body,(result) => {
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
  
  router.put('/updatemobileno',verifyToken,function(req,res,next){
      if(typeof req.body === 'undefined'){
          res.statusCode = 400;
          res.json({result:'0',message:'no request content'});
      }else{
          Customer.updatemobileno(req.body,(result) => {
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

  router.post('/signout',verifyToken,function(req,res,next){
    if(typeof req.body === 'undefined'){
        res.statusCode = 400;
        res.json({result:'0',message:'no request content'});
    }else{
        Customer.userSessionOut(req.body,(result) => {
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

router.put('/updateInfo', verifyToken, function (req, res, next) {
  //console.log('request body...',req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    Customer.updateUserAccountInfo(req.body, (result) => {
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
router.put('/updateActiveTime', verifyToken, function (req, res, next) {
  //console.log('request body...',req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
      Customer.updateUserActiveTime(req.body, (result) => {
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
router.put('/uploadFile', function (req, res, next) {
  console.log('request body...',req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
    let requiredData = JSON.parse(req.body.updateInfo);
    Customer.fileUploadToServer(requiredData, req.files, req.headers, req, (result) => {
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
router.post('/deleteFile', verifyToken, function (req, res, next) {
  //console.log('request body...',req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
      Customer.fileDelete(req.body, (result) => {
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

router.post('/validateCoupon', verifyToken, function (req, res, next) {
  //console.log('request body...',req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
      Customer.couponValidate(req.body, (result) => {
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
router.post('/refer',function(req,res,next){
  Customer.referralGenerating((result) => {
    console.log('result',result.status);
    if(result.status === 400) {
        res.statusCode = result.status;
        res.send(result.data.message);
        return;
    }
    res.json(result.data);
});
});

router.post('/fetchReferralUsers_Earnings', verifyToken, function (req, res, next) {
  //console.log('request body...',req.body);
  if (typeof req.body === 'undefined') {
    res.json({ result: '0', message: 'no request content' });
  } else {
      Customer.fetchCustomerReferralUsersItsEarnings(req.body, (result) => {
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