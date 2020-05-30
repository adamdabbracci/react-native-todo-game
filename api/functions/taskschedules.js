'use strict';

const dynamodb = require('./dynamodb');
const TaskScheduleService = require('../services/taskschedule.service');
const taskScheduleService = new TaskScheduleService();

module.exports.create = async (event, context) => {
  const createdBy = event.requestContext.authorizer.claims.sub;
  const body = JSON.parse(event.body);
  console.log(body);
  
  // fetch task from the database
  const scheduled = await taskScheduleService.createTaskSchedule(createdBy, body);
  return {
    statusCode: 200,
    body: JSON.stringify(scheduled)
  }
};

module.exports.list = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;
  
  // fetch task from the database
  if (event.pathParameters.queryType === "created") {
    const schedules = await taskScheduleService.getTaskSchedulesByCreator(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(schedules)
    }
  }
  else if (event.pathParameters.queryType === "assigned") {
    const schedules = await taskScheduleService.getTaskSchedulesByAssignedTo(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(schedules)
    }
  }
  
};
