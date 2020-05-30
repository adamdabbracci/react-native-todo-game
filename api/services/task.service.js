const dynamodb = require('../functions/dynamodb');

const uuid = require('uuid');

module.exports = class TaskService {
    getTask = async (taskId) => {
        const params = {
          TableName: process.env.TASKS_TABLE,
          Key: {
            id: taskId,
          },
        };
      
        // fetch task from the database
        const results = await dynamodb.get(params).promise();
        return results.Item;
      }

      createTask = async (task) => {
        const timestamp = new Date().getTime();

        const params = {
          TableName: process.env.TASKS_TABLE,
          Item: {
            id: uuid.v4(),
            name: task.name,
            assigned_to: task.assigned_to,
            created_by: task.created_by,
            description: task.description,
            coin_reward: task.coin_reward,
            schedule_id: task.schedule_id || null,
            completed: false,
            created_at: timestamp,
            updated_at: timestamp,
          },
        };
      
        // write the task to the database
        const results = await dynamodb.put(params).promise();
        return results.Attributes;
      }


      // getAllByDate = async (date) => {

      //   const params = {
      //     TableName: process.env.TASKS_TABLE,
        
      //     FilterExpression: "assigned_to = :userId", 
      //     ExpressionAttributeValues: {
      //       ':userId': userId,
      //     }, 
      //   };
      // }


      
      
}