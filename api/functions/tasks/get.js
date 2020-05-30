'use strict';

const dynamodb = require('../dynamodb');

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.TASKS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch task from the database
  dynamodb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the task item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
