const CronJob = require('cron').CronJob;
const BookingReminders = require('./FetchBookings');

// AutoBackUp every week (at 00:00 on Sunday)
console.log('job started...')
new CronJob(
  '04 11 *  *  *',
  function() {
    BookingReminders.fetchAllBookingFunction();
  },
  null,
  true,
  'Asia/Kolkata'
);

