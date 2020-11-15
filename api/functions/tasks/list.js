'use strict';

const dynamodb = require('../dynamodb');
const moment = require('moment');
const TaskService = require('../../services/task.service');
const getUserId = require('../../security/middleware').getUserId;
const taskService = new TaskService();

module.exports.list = async (event, context) => {
  // console.log(event)
  const userId = getUserId(event);
  const tasks = await taskService.getAllTasksByDate(userId, new Date());
  return {
    statusCode: 200,
    body: JSON.stringify(tasks),
  }
};
