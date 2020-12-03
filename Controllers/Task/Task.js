const ReportTask = require('./Report Task');

var task = {

    insert: (params, callback) => {
        return ReportTask.task(params, callback);
    }

};
module.exports = task;
