'use strict';

const dynamodb = require('../dynamodb');
const moment = require('moment');

const UserService = require("../../services/user.service");
const TaskService = require("../../services/task.service");
const { User } = require('../../services/database.service');

const userService = new UserService();
const taskService = new TaskService();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.log('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the task item.',
    });
    return;
  }

  const params = {
    TableName: process.env.TASKS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#task_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updated_at': timestamp,
    },
    UpdateExpression: 'SET #task_text = :text, checked = :checked, updated_at = :updated_at',
    ReturnValues: 'ALL_NEW',
  };

  // update the task in the database
  dynamodb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the task item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};

/**
 * Mark as task as complete
 */
module.exports.complete = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  const data = JSON.parse(event.body);


  // Load the details of the task
  const existingTask = await taskService.getTask(event.pathParameters.id);

  if (!existingTask) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Invalid ID"
      })
    }
  }

  existingTask.status = "Complete";
  existingTask.completed_at = moment().utc().startOf("day").toDate();
  const saved = await existingTask.save();

  console.log(`UPDATED TASK ${event.pathParameters.id}`);
  
  const user = await User.findByPk(userId)
  await User.update({
    coins: user.coins + existingTask.coin_reward
  }, {
    where: {
      id: userId,
    }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(saved)
  }
}