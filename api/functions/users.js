const UserService = require('../services/user.service');

const userService = new UserService();

module.exports.getUser = async (event, context) => {
  let id = event.pathParameters.id

  const results = await userService.getUser(id);
  return {
    statusCode: 200,
    body: JSON.stringify(results)
  }
};

module.exports.searchByUsername = async (event, context) => {
    const createdBy = event.requestContext.authorizer.claims.sub;
    let query = event.queryStringParameters.username

    const results = await userService.searchUsersByUsername(query);
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  };