const dynamodb = require('../functions/dynamodb');
const moment = require('moment');
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

      getAllTasksByDate = async (userId, date) => {
        const params = {
          TableName: process.env.TASKS_TABLE,
         
           FilterExpression: "assigned_to = :userId AND (assigned_date = :assigned_date OR attribute_not_exists(assigned_date) )", 
           ExpressionAttributeValues: {
            ':userId': userId,
            ':assigned_date': moment(date).format("MM-DD-YYYY"),
           }, 
        };

        const results = await dynamodb.scan(params).promise();
        return results.Items;
      }

      getTasksBySchedule = async (scheduleId) => {
        const params = {
          TableName: process.env.TASKS_TABLE,
         
           FilterExpression: "schedule_id = :scheduleId", 
           ExpressionAttributeValues: {
            ':scheduleId': scheduleId,
           }, 
        };
        const results = await dynamodb.scan(params).promise();
        return results.Items;
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
            assigned_date: task.assigned_date,
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

      deleteTask = async (taskId) => {
        const params = {
          TableName: process.env.TASKS_TABLE,
          Key: {
            id: event.pathParameters.id,
          },
        };
      
        // delete the task from the database
        const result = await dynamodb.delete(params).promise();
        return result.Attributes;
      }

      deleteIncompleteTasksByScheduleId = async (scheduleId) => {

        let tasks = await this.getTasksBySchedule(scheduleId);
        // Filter out completed tasks
        tasks = tasks.filter(x => !x.completed);
        
        for (let index = 0; index < tasks.length; index++) {
          const element = tasks[index];
          const params = {
            TableName: process.env.TASKS_TABLE,
            Key: {
              id: element.id,
            },
          };
          console.log("DELETE:")
          console.log(params);
          await dynamodb.delete(params).promise();

        }
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