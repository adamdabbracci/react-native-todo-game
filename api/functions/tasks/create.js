'use strict';

const TaskService = require('../../services/task.service');
const taskService = new TaskService();
const getUserId = require('../../security/middleware').getUserId;

module.exports.create = async (event, context) => {

  const userId = getUserId(event);


  const task = JSON.parse(event.body);
  task.created_by = userId;
  
  const results = await taskService.createTask(task);

  
  return {
    statusCode: 201,
  };
  
};

