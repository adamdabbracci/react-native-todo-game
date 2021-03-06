'use strict';

const dynamodb = require('../dynamodb');

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.TASKS_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // delete the task from the database
  dynamodb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the task item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({}),
    };
    callback(null, response);
  });
};
