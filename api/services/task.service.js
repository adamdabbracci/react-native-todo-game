const dynamodb = require('../functions/dynamodb');
const moment = require('moment');
const uuid = require('uuid');
const { Task } = require('./database.service');

module.exports = class TaskService {
    getTask = async (taskId) => {
        return Task.findByPk(taskId)
      }

      getAllTasksByDate = async (userId, date) => {
        return Task.findAll({
          where: {
            assigned_to: userId,
            assigned_date: moment(date).utc().startOf("day").toDate()
          }
        })
      }

      getTasksBySchedule = async (scheduleId) => {
        return Task.findAll({
          where: {
            schedule_id: scheduleId,
          }
        })
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

      updateTask = async (task) => {
        return Task.update(task)
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
          console.log("DELETING INCOMPLETE TASK:")
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