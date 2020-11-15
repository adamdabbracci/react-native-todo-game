'use strict';

const dynamodb = require('./dynamodb');
const AccountService = require('../services/account.service');
const getUserId = require('../security/middleware').getUserId;

const accountService = new AccountService();

module.exports.getAccount = async (event, context) => {
  const userId = getUserId(event);

  // fetch task from the database
  const account = await accountService.getAccount(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};

module.exports.getBank = async (event, context) => {
  const userId = getUserId(event);

  // fetch task from the database
  const account = await accountService.getBank(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};



module.exports.getSponsorships = async (event, context) => {
  const userId = getUserId(event);

  // fetch task from the database
  const sponsorships = await accountService.getSponsorships(userId);

  return {
    statusCode: 200,
    body: JSON.stringify(sponsorships)
  }
};


module.exports.requestSponsorship = async (event, context) => {
  const userId = getUserId(event);
  console.log(event.body)
  const sponsorId = JSON.parse(event.body).sponsor_id;

  // fetch task from the database
  const account = await accountService.requestSponsorship(userId, sponsorId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};

module.exports.getAssignableUsers = async (event, context) => {
  const userId = getUserId(event);

  // fetch task from the database
  const account = await accountService.getAssignableUsers(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};
