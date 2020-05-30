'use strict';

const TaskService = require('../../services/task.service');
const taskService = new TaskService();

module.exports.create = async (event, context) => {

  console.log(event.requestContext.authorizer)
  const userId = event.requestContext.authorizer.claims.sub;


  const task = JSON.parse(event.body);
  task.created_by = userId;
  
  const results = await taskService.createTask(task);
  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
  
};

