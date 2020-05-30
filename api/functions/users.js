'use strict';

const dynamodb = require('./dynamodb');
const cognito = require('./cognito');
const UserService = require('../services/user.service');

const userService = new UserService();

module.exports.getAssignableUsers = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;
  
  // fetch task from the database
  const users = await userService.getAssignableUsers(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(users)
  }
  
};
