var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../app/ConfigFiles/config.json'); // get our config file

function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['startasker'];
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, config.secretkey, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.'});    

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    console.log(req.userId);
    next();
  });
}
module.exports = verifyToken;