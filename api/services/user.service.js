const dynamodb = require('../functions/dynamodb');


module.exports = class UserService {
    getUser = async (userId) => {
        const params = {
          TableName: process.env.USERS_TABLE,
          Key: {
            id: userId,
          },
        };

        const results = await dynamodb.get(params).promise();

        // Create one if it doesn't exist
        if (!results.Item) {
          console.log(`USER ${userId} NOT FOUND, CREATING`)
          await this.createUser(userId);

          const newUser = await dynamodb.get(params).promise();
          return newUser.Item;
        }
        else {
          return results.Item;
        }
        
      }
    
      createUser = async (userId) => {
        const params = {
          TableName: process.env.USERS_TABLE,
          Item: {
            id: userId,
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
            ':updatedAt': new Date().getTime(),
    
          },
          UpdateExpression: 'SET coins = :coins, tickets = :tickets, updatedAt = :updatedAt',
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