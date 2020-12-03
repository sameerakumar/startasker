const dbQueries = require('./CustomerDBQueries');
const paramValidator = require('./CustomerParamsValidation');
const statusCodes = require('../Core/StatusCodes');
var CheckCouponAvailability = {
    checkCouponAvailability:(params,callback) =>{
        const { error } = paramValidator.validateCouponAvailablity(params);
        if (error) {
            return callback({
                status: 400,
                data: {
                    response: statusCodes.failure,
                    message: error.details[0].message
                }
            });
        }
        let findCoupon = dbQueries.getUserCouponByCouponCode(params);
        findCoupon.then((isFound)=>{
            if(isFound){
               // console.log('user coupons..',isFound);
                var output = Object.assign({}, ...isFound.coupons)
                  console.log('user coupons..',output);
                  if(output.applied == true){
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.failure,
                            message: 'Given coupon is already used'
                        }
                    });
                  }else{
                    return callback({
                        status: 200,
                        data: {
                            response: statusCodes.success,
                            message: 'Given coupon is valid'
                        }
                    });
                  }
            }else{
                return callback({
                    status: 200,
                    data: {
                        response: statusCodes.failure,
                        message: 'Coupon code no found'
                    }
                });
            }
        })
    }
}

module.exports = CheckCouponAvailability;