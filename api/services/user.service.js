const dynamodb = require('../functions/dynamodb');
const cognito = require('../functions/cognito');
const { User } = require('./database.service')

module.exports = class UserService {
    createUser = async (userId) => {
          const getConfig = {
            Username: userId,
            UserPoolId: process.env.COGNITO_POOL_ID
          };
      const cognitoUser = await cognito.identityServiceProvider.adminGetUser(getConfig).promise()

      if (!cognitoUser) {
        console.log(`No cognito user found for ID ${userId}`)
        throw (`Invalid user ID`)
      }

        const user = {
          id: cognitoUser.UserAttributes.find(x => x.Name === 'sub').Value,
          email_address: cognitoUser.UserAttributes.find(x => x.Name === 'email').Value,
          coins: 0,
        }
        console.log("CREATING USER:")
        console.log(user)
        return User.create(user);
    }

    getBank = async (userId) => {
      return User.findByPk(userId, {
        attributes: ["coins"],
      })
    }
    getUser = async (userId) => {
      try {
        const user =  await User.findOne({
          where: {
            id: userId
          }
        })

        if (user) {
          return user
        } 
        else {
          // Creat it
          await this.createUser(userId)
          // Query it
          return User.findOne({
            where: {
              id: userId
            }
          })
        }
        
      } catch(ex) {
        console.log(ex);
        throw ex
      }

      // console.log(db)
      //   const params = {
      //     TableName: process.env.USERS_TABLE,
      //     Key: {
      //       id: userId,
      //     },
      //   };

      // console.log(params)


      //   const results = await dynamodb.get(params).promise();

      //   // Create one if it doesn't exist
      //   if (!results.Item) {
      //     console.log(`USER ${userId} NOT FOUND, CREATING`);
      //     const getConfig = {
      //       Username: userId,
      //       UserPoolId: process.env.COGNITO_POOL_ID
      //     };
      //     console.log(getConfig)

      //     const cognitoUser = await cognito.identityServiceProvider.adminGetUser(getConfig).promise();
      //     console.log(cognitoUser)


      //     await this.createUser({
      //       id: userId,
      //       email_address: cognitoUser.UserAttributes.find(x => x.Name === 'email').Value,
      //     });

      //     const newUser = await dynamodb.get(params).promise();
      //     return newUser.Item;
      //   }
      //   else {
      //     return results.Item;
      //   }
        
      }

      getAssignableUsers = async (userId) => {
        const params = {
          TableName: process.env.USERS_TABLE,
        };

        // TODO Pull by "parent" on each user
        const results = await dynamodb.scan(params).promise();
        return results.Items;
        
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