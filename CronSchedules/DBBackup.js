const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require('path');
// Concatenate root directory path with our backup folder.
const backupDirPath = path.join(__dirname,'/mongodb-backup');

const dbOptions = {
  user: 'vedaslabs',
  pass: 'Startasker57',
  host: '127.0.0.1',
  port: 27017,
  database: 'startasker',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 1,
  autoBackupPath:backupDirPath
};

// return stringDate as a date object.
exports.stringToDate = dateString => {
  return new Date(dateString);
};

// Check if variable is empty or not.
exports.empty = mixedVar => {
  let undef, key, i, len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {
  // check for auto backup is enabled or disabled
  console.log('called backup functions...')
  if (dbOptions.autoBackup == true) {
    let date = new Date();
    let beforeDate, oldBackupDir, oldBackupPath;

    // Current date
    currentDate = this.stringToDate(date);
    let newBackupDir =  currentDate.getFullYear() +'-' +(currentDate.getMonth() + 1) +'-' +currentDate.getDate();

    // New backup path for current backup process
    let newBackupPath = dbOptions.autoBackupPath + '-mongodump-' + newBackupDir;
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =  beforeDate.getFullYear() +'-' +
        (beforeDate.getMonth() + 1) +
        '-' +
        beforeDate.getDate();
      // old backup(after keeping # of days)
      oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir;
    }

    // Command for mongodb dump process
    let cmd =
      'mongodump --host ' +
      dbOptions.host +
      ' --port ' +
      dbOptions.port +
      ' --db ' +
      dbOptions.database +
      ' --username ' +
      dbOptions.user +
      ' --password ' +
      dbOptions.pass +
      ' --out ' +
      newBackupPath;

    exec(cmd, (error, stdout, stderr) => {
      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          if (fs.existsSync(oldBackupPath)) {
            exec('rm -rf ' + oldBackupPath, err => {});
          }
        }
      }
    });
  }else{
    console.log('db auto backup not enabled...')
  }
};
