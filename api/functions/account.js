'use strict';

const dynamodb = require('./dynamodb');
const UserService = require('../services/user.service');

const userService = new UserService();

module.exports.getAccount = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  // fetch task from the database
  const account = await userService.getUser(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};

module.exports.getBank = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  // fetch task from the database
  const account = await userService.getBank(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};
