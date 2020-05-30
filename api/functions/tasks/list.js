'use strict';

const dynamodb = require('../dynamodb');

module.exports.list = (event, context, callback) => {
  // console.log(event)
  const userId = event.requestContext.authorizer.claims.sub;

  const params = {
    TableName: process.env.TASKS_TABLE,
   
     FilterExpression: "assigned_to = :userId", 
     ExpressionAttributeValues: {
      ':userId': userId,
     }, 
  };

  console.log(params)

  // fetch all tasks from the database
  dynamodb.scan(params, (error, result) => {
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
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
