'use strict';

const dynamodb = require('./dynamodb');
const TaskScheduleService = require('../services/taskschedule.service');
const TaskService = require('../services/task.service');

const taskScheduleService = new TaskScheduleService();
const taskService = new TaskService();

module.exports.create = async (event, context) => {
  const createdBy = event.requestContext.authorizer.claims.sub;
  let body = JSON.parse(event.body);
  body.created_by = createdBy;
  
  // fetch task from the database
  const scheduled = await taskScheduleService.createTaskSchedule(body);
  return {
    statusCode: 200,
    body: JSON.stringify(scheduled)
  }
};

module.exports.list = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;
  
  const schedules = await taskScheduleService.getTaskSchedulesByCreator(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(schedules)
    }
  
};

module.exports.listTasksFromSchedule = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const scheduleId = event.pathParameters.id;

  const tasks = await taskService.getTasksBySchedule(scheduleId);
    return {
      statusCode: 200,
      body: JSON.stringify(tasks)
    }
};
