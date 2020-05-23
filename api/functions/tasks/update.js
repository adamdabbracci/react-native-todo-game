'use strict';

const dynamodb = require('../dynamodb');
const UserService = require("../../services/user.service");
const TasksService = require("../../services/tasks.service");

const userService = new UserService();
const tasksService = new TasksService();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the task item.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#task_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #task_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the task in the database
  dynamodb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
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

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);


  // Load the details of the task
  const existingTask = await tasksService.getTask(event.pathParameters.id);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    // ExpressionAttributeNames: {
    //   '#task_text': 'text',
    // },
    ExpressionAttributeValues: {
      ':completed': true,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET completed = :completed, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the task in the database
  const updated = await dynamodb.update(params).promise();

  console.log(`UPDATED TASK ${event.pathParameters.id}`);

  // update the users bank
  const user =  await userService.getUser(userId);
  if (user) {
    console.log(`RETRIEVED USER ${userId}`);
    console.log(user)
    
    user.coins += parseInt(existingTask["coin_reward"]);

    await userService.updateUser(user);

    return {
      statusCode: 200,
      body: JSON.stringify(updated.Attributes)
    }
  }
  else {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "No account found matching target user.",
      })
    }
  }
}