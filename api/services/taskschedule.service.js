const dynamodb = require('../functions/dynamodb');
const uuid = require('uuid');
const moment = require("moment");
const rrule = require("rrule");
const TaskSchedule = require("../models/taskschedule.model");

module.exports = class TaskScheduleService {
    getTaskSchedule = async (id) => {
        const params = {
          TableName: process.env.TASK_SCHEDULES_TABLE,
          Key: {
            id: id,
          },
        };

        const results = await dynamodb.get(params).promise();

        return results.Item;
      }

     /**
      * Returns all schedules that meet a given date
      *
      */
     getActiveSchedulesForDate = async (date) => {

        const params = {
          TableName: process.env.TASK_SCHEDULES_TABLE,
        
          FilterExpression: "start_date <= :date AND end_date >= :date", 
          ExpressionAttributeValues: {
            ':date': date,
          }, 
        };

        console.log(params)
        const results = await dynamodb.scan(params).promise();
        return results.Items;
      }

      getTaskSchedulesByCreator = async (userId) => {
        const params = {
          TableName: process.env.TASK_SCHEDULES_TABLE,
         
           FilterExpression: "created_by = :userId", 
           ExpressionAttributeValues: {
            ':userId': userId,
           }, 
        };
      

        const results = await dynamodb.scan(params).promise();

        return results.Items;
      }

      getTaskSchedulesByAssignedTo = async (userId) => {
        const params = {
          TableName: process.env.TASK_SCHEDULES_TABLE,
         
           FilterExpression: "assigned_to = :userId", 
           ExpressionAttributeValues: {
            ':userId': userId,
           }, 
        };

        const results = await dynamodb.scan(params).promise();

        return results.Items;
      }
    

    createTaskSchedule = async (_taskSchedule) => {

      
      const startMoment =  moment(_taskSchedule.start_date).utc().startOf("day");
      const endMoment = moment(_taskSchedule.end_date).utc().endOf("day");

        // Build an rRule string: http://jakubroztocil.github.io/rrule/
      const newRRule = new rrule.RRule({
        dtstart: startMoment.toDate(),
        until: endMoment.toDate(),
        freq: rrule.RRule[_taskSchedule.frequency],
      });

      try {
        const taskSchedule = Object.assign(new TaskSchedule(), _taskSchedule);
        taskSchedule.id = uuid.v4();
        taskSchedule.start_date = startMoment.unix();
        taskSchedule.start_date_string = startMoment.toISOString();
        taskSchedule.end_date = endMoment.unix();
        taskSchedule.end_date_string = endMoment.toISOString();
        taskSchedule.rrule = newRRule.toString();

        const timestamp = new Date().getTime();
        
        const params = {
          TableName: process.env.TASK_SCHEDULES_TABLE,
          Item: {
            ...taskSchedule,
            created_at: timestamp,
            updated_at: timestamp,
          },
        };

        // write the task to the database
        console.log(params)
        const result = await dynamodb.put(params).promise();
        return result;
      }

      catch (ex) {
        console.log(ex)
        throw new Error(ex);
      }
    }
}