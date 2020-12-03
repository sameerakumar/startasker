const CronJob = require('cron').CronJob;
const Cron = require('./PostJobDateStatus');
console.log('job started...');
new CronJob(    
    "55 23 * * *",
    function() {
        Cron.status();
    },
    null,
    true,
    'Asia/Kolkata'
);
