'use strict';

const TaskScheduleService = require('../services/taskschedule.service');
const taskScheduleService = new TaskScheduleService();
const getUserId = require('../security/middleware').getUserId;

module.exports.create = async (event, context) => {
  const createdBy = event.requestContext.authorizer.claims.sub;
  let body = JSON.parse(event.body);
  body.created_by = createdBy;
  
  // fetch task from the database
  const scheduled = await taskScheduleService.createTaskSchedule(body);
  return {
    statusCode: 201,
    body: JSON.stringify(scheduled)
  }
};


module.exports.update = async (event, context) => {
  const createdBy = event.requestContext.authorizer.claims.sub;
  let body = JSON.parse(event.body);
  body.created_by = createdBy;
  const id = event.pathParameters.id;
  

  
  // fetch task from the database
  const scheduled = await taskScheduleService.updateTaskSchedule(id, body);
  return {
    statusCode: 204,
    body: JSON.stringify(scheduled)
  }
};

module.exports.list = async (event, context) => {
  const userId = getUserId(event);
  
  const schedules = await taskScheduleService.getTaskSchedulesByCreator(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(schedules)
    }
  
};

module.exports.get = async (event, context) => {
  const userId = getUserId(event);
  const scheduleId = event.pathParameters.id;

  const tasks = await taskScheduleService.getTaskSchedule(scheduleId);
    return {
      statusCode: 200,
      body: JSON.stringify(tasks)
    }
};
