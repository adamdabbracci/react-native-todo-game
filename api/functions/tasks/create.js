'use strict';

const TaskService = require('../../services/task.service');
const taskService = new TaskService();

module.exports.create = async (event, context) => {

  const userId = event.requestContext.authorizer.claims.sub;


  const task = JSON.parse(event.body);
  task.created_by = userId;
  
  const results = await taskService.createTask(task);

  
  return {
    statusCode: 201,
  };
  
};

