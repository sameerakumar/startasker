const Tasks = require('../../app/Models/Task');

var Task ={

    InsertQuery:(params) => {
        const register_timestamp = new Date().getTime().toString();
        let task = new Tasks({
            userID:params.userID,
            type: params.type,
            message: params.message,
            timestamp:register_timestamp
        });
        return task;
    }


};
module.exports=Task;