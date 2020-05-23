'use strict';

const dynamodb = require('./dynamodb');
const cognito = require('./cognito');

module.exports.getAssignableUsers = (event, context, callback) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const cognitoPoolId = process.env.COGNITO_POOL_ID || "NO POOL ID FOUND";
  
  var params = {
    UserPoolId: cognitoPoolId,
  };

  cognito.listUsers(params, (err, data) => {
    if (err) {
      
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err)
      })

    } else {
      console.log(data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      }) // here is the success return
    }
  });

  
};
