'use strict';

const dynamodb = require('./dynamodb');
const AccountService = require('../services/account.service');

const accountService = new AccountService();

module.exports.getAccount = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  // fetch task from the database
  const account = await accountService.getUser(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};

module.exports.getBank = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  // fetch task from the database
  const account = await accountService.getBank(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};



module.exports.getSponsorships = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  // fetch task from the database
  const sponsorships = await accountService.getSponsorships(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      sponsors: sponsorships.filter(x => x.sponsor_id === userId),
      sponsees: sponsorships.filter(x => x.sponsee_id === userId),
    })
  }
};


module.exports.requestSponsorship = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;
  const sponsorId = JSON.parse(event.body).sponsor_id;

  // fetch task from the database
  const account = await accountService.requestSponsorship(userId, sponsorId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};

module.exports.getAssignableUsers = async (event, context) => {
  const userId = event.requestContext.authorizer.claims.sub;

  // fetch task from the database
  const account = await accountService.getAssignableUsers(userId);
  return {
    statusCode: 200,
    body: JSON.stringify(account)
  }
};
