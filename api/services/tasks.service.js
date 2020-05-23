const dynamodb = require('../functions/dynamodb');


module.exports = class TasksService {
    getTask = async (taskId) => {
        const params = {
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            id: taskId,
          },
        };
      
        // fetch task from the database
        const results = await dynamodb.get(params).promise();
        return results.Item;
      }
    
}