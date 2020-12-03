const CronJob = require('cron').CronJob;
const BackupBump = require('../CronSchedules/DBBackup');


// AutoBackUp every week (at 00:00 on Sunday)
console.log('job started...')
new CronJob(
  '20 17 *  *  *',
  function() {
    BackupBump.dbAutoBackUp();
  },
  null,
  true,
  'Asia/Kolkata'
);

