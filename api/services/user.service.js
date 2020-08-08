const dynamodb = require('../functions/dynamodb');
const cognito = require('../functions/cognito');


module.exports = class UserService {
    getUser = async (userId) => {
        const params = {
          TableName: process.env.USERS_TABLE,
          Key: {
            id: userId,
          },
        };

      console.log(params)


        const results = await dynamodb.get(params).promise();

        // Create one if it doesn't exist
        if (!results.Item) {
          console.log(`USER ${userId} NOT FOUND, CREATING`);
          const getConfig = {
            Username: userId,
            UserPoolId: process.env.COGNITO_POOL_ID
          };
          console.log(getConfig)

          const cognitoUser = await cognito.identityServiceProvider.adminGetUser(getConfig).promise();
          console.log(cognitoUser)


          await this.createUser({
            id: userId,
            email_address: cognitoUser.UserAttributes.find(x => x.Name === 'email').Value,
          });

          const newUser = await dynamodb.get(params).promise();
          return newUser.Item;
        }
        else {
          return results.Item;
        }
        
      }

      getAssignableUsers = async (userId) => {
        const params = {
          TableName: process.env.USERS_TABLE,
        };

        // TODO Pull by "parent" on each user
        const results = await dynamodb.scan(params).promise();
        return results.Items;
        
      }
    
      createUser = async (user) => {
        const params = {
          TableName: process.env.USERS_TABLE,
          Item: {
            id: user.id,
            email_address: user.email_address,
            coins: 50,
            tickets: 1,
          }
        };
    
        return dynamodb.put(params).promise();
      }
    
    
      updateUser = async (user) => {
        const params = {
          TableName: process.env.USERS_TABLE,
          Key: {
            id: user.id
          },
          ExpressionAttributeValues: {
            ':coins': user.coins,
            ':tickets': user.tickets,
            ':updated_at': new Date().getTime(),
    
          },
          UpdateExpression: 'SET coins = :coins, tickets = :tickets, updated_at = :updated_at',
          ReturnValues: 'ALL_NEW',
        };
    
        dynamodb.update(params, (error, result) => {
          if (!error) {
             return result.Item;
          }
          else {
            throw new Error(error);
          }
        })
      }
}