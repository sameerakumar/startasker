var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var Customer = require('./routes/Customer');
var PostJobs = require('./routes/PostJobs');
var categories = require('./routes/Categories');
//var Provider = require('./routes/Provider');
var Feedback = require('./routes/FeedBack');
var AddCard = require('./routes/AddCard');
var Task = require('./routes/Task');
var Deal = require('./routes/Deals');
var Bookings = require('./routes/Bookings');
var Review = require('./routes/Review');
var offers = require('./routes/OffersUpdate');
var Inbox = require('./routes/Inbox');
var AddEmergencyContact = require('./routes/AddContacts');
var ShareFeedback = require('./routes/ShareFeedBack');
var AccountVerification = require('./routes/AccountVerification');
var Admin = require('./routes/Admin');
var app = express();
global.CronJob = require('./CronSchedules/DBBackUpCronJob');
global.CronJob = require('./Controllers/PostJobs/PostCornJob');
global.CronJob = require('./Controllers/Bookings/JobRemindersCronJob')
global.CronJob = require('./Controllers/Bookings/CronJobForPendingJobsMakesBooking');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/customer', Customer);
app.use('/api/postjob', PostJobs);
app.use('/api/categories', categories);
//app.use('/api/provider', Provider);
app.use('/api/feedback',Feedback);
app.use('/api/task',Task)
app.use('/api/addcard',AddCard);
app.use('/api/deal',Deal);
app.use('/api/hire',Bookings);
app.use('/api/ratings',Review);
app.use('/api/offers',offers);
app.use('/api/inbox',Inbox);
app.use('/api/addemergencycontact',AddEmergencyContact);
app.use('/api/share',ShareFeedback);
app.use('/api/AccountVerify',AccountVerification);
app.use('/api/admin',Admin);
//app.use('/api/customer',CustomerRegister);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');  
});

module.exports = app;
