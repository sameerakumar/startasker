const CronJob = require('cron').CronJob;
const PendingBookingConfirmation = require('./PaymentStatusUpdate');

// AutoBackUp every week (at 00:00 on Sunday)
console.log('job started...')
new CronJob(
  '* * *  *  *',
  function() {
    PendingBookingConfirmation.checkPaymentStatus();
  },
  null,
  true,
  'Asia/Kolkata'
);
