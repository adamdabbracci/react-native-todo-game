const dynamodb = require('../functions/dynamodb');
const cognito = require('../functions/cognito');
const { User, Sponsorship, Task, Op } = require('./database.service')

module.exports = class AccountService {
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
          username: cognitoUser.UserAttributes.find(x => x.Name === 'email').Value,
          coins: 0,
        }
        console.log("CREATING USER:")
        console.log(user)
        return User.create(user);
    }

    getBank = async (userId) => {
      const user = await User.findByPk(userId, {
        attributes: ["coins"],
      })
      if (!user) {
        return this.createUser(userId)
      }
      else {
        return user
      }
    }

    getSponsorships = async (userId) => {
      const sponsorships =  await Sponsorship.findAll({
        where: {
          [Op.or]: [
            { sponsee_id: userId },
            { sponsor_id: userId },
          ]
        }
      })

      // We have to sort of reverse the logic. If User A sponsors User B,
      // any rows that have User A as the sponsor need to return under "sponsees",
      // because User A will want to see the sponsee on that row
      const result = {
        sponsors: sponsorships.filter(x => x.sponsee_id === userId).map(x => x.sponsor),
        sponsees: sponsorships.filter(x => x.sponsor_id === userId).map(x => x.sponsee),
      }

      return result;
    }

    requestSponsorship = async (sponseeId, sponsorId) => {
      const existingSponsorship = await Sponsorship.findOne({
        where: {
          sponsee_id: sponseeId,
          sponsor_id: sponsorId,
        }
      })

      if (existingSponsorship) {
        console.log(`Existing sponsorship found between SPONSEE: ${sponseeId} and SPONSOR: ${sponsorId}`)
        return existingSponsorship
      }

      const created = await Sponsorship.create({
        sponsee_id: sponseeId,
        sponsor_id: sponsorId,
      })
      console.log(`Created new sponsorship between SPONSEE: ${sponseeId} and SPONSOR: ${sponsorId}`)

      return created;
    }

    getAssignableUsers = async (userId) => {
      const sponsorships = await Sponsorship.findAll({
        where: {
          sponsee_id: userId
        }
      })

      return sponsorships.map(x => x.sponsee)
      
    }

    getAccount = async (userId) => {
      try {
        const user =  await User.findOne({
          where: {
            id: userId
          },
          include: [ Task ]
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
              id: userId,
            }
          })
        }
        
      } catch(ex) {
        console.log(ex);
        throw ex
      }

      }
}

var grams = {
  " ": {0.6294: "s", 1.0: "t", 0.5166: "i", 0.2635: "c", 0.1255: "h", 0.7882: "a", 0.4297: "w", 0.1915: "b", 0.3464: "o", 0.0603: "f"},
  "a": {1.0: "n", 0.507: "l", 0.1379: "i", 0.3973: " ", 0.0446: "y", 0.6368: "r", 0.1865: "c", 0.0895: "m", 0.2906: "s", 0.7853: "t"},
  "c": {1.0: "o", 0.078: "r", 0.7882: "h", 0.3303: "t", 0.6334: "e", 0.181: "i", 0.0365: " ", 0.4808: "a", 0.2455: "k", 0.1214: "l"},
  "b": {1.0: "e", 0.0168: "s", 0.5666: "o", 0.3311: "l", 0.7064: "a", 0.042: " ", 0.2285: "i", 0.1634: "r", 0.1023: "y", 0.445: "u"},
  "e": {1.0: " ", 0.3763: "s", 0.2035: "a", 0.2859: "d", 0.0326: "c", 0.6218: "r", 0.1016: "e", 0.0666: "t", 0.14: "l", 0.4732: "n"},
  "d": {0.4397: "e", 1.0: " ", 0.0217: "d", 0.0671: "u", 0.044: "r", 0.0109: "y", 0.2946: "i", 0.0974: "s", 0.1495: "a", 0.2076: "o"},
  "g": {0.4683: "h", 1.0: " ", 0.0461: "s", 0.3648: "o", 0.0214: "n", 0.1991: "r", 0.2811: "a", 0.0805: "u", 0.1315: "i", 0.6221: "e"},
  "f": {0.1547: "a", 1.0: " ", 0.0923: "t", 0.0555: "u", 0.3867: "e", 0.2186: "f", 0.2981: "r", 0.0235: "l", 0.5046: "i", 0.7035: "o"},
  "i": {0.125: "e", 1.0: "n", 0.5324: "s", 0.1826: "d", 0.4017: "c", 0.3255: "o", 0.6677: "t", 0.2528: "l", 0.0382: "g", 0.081: "r"},
  "h": {0.0636: "t", 1.0: "e", 0.0099: "y", 0.3911: "i", 0.0382: "r", 0.0043: "n", 0.1563: "o", 0.2699: " ", 0.0219: "u", 0.5663: "a"},
  "k": {1.0: "e", 0.0184: "y", 0.2099: "s", 0.0336: "o", 0.1346: "n", 0.0828: "a", 0.664: " ", 0.0066: "u", 0.0526: "l", 0.3508: "i"},
  "j": {0.3455: "a", 1.0: "u", 0.0009: "s", 0.0314: " ", 0.2002: "e", 0.0618: "i", 0.0051: "p", 0.0021: "c", 0.6376: "o", 0.0132: "r"},
  "m": {1.0: "e", 0.7376: "a", 0.0544: "b", 0.2917: "i", 0.1154: "u", 0.4078: "o", 0.0265: "s", 0.1847: "p", 0.5582: " ", 0.0833: "m"},
  "l": {1.0: " ", 0.8256: "e", 0.0557: "s", 0.5064: "i", 0.2714: "o", 0.0221: "u", 0.1913: "y", 0.6551: "l", 0.3799: "a", 0.1173: "d"},
  "o": {0.4793: "u", 1.0: "n", 0.8009: " ", 0.0373: "o", 0.3502: "f", 0.1282: "w", 0.0817: "l", 0.1832: "t", 0.6375: "r", 0.2536: "m"},
  "n": {1.0: " ", 0.5597: "g", 0.4228: "t", 0.1167: "i", 0.3088: "e", 0.7117: "d", 0.2199: "s", 0.0764: "c", 0.0377: "a", 0.1673: "o"},
  "q": {1.0: "u", 0.0059: "l", 0.0136: "b", 0.0017: "s", 0.0348: "i", 0.0218: "a", 0.003: "w", 0.0043: "w", 0.0006: "v", 0.0888: " "},
  "p": {1.0: "e", 0.18: "i", 0.5315: "a", 0.4013: "l", 0.8133: "r", 0.124: "p", 0.2815: " ", 0.0687: "u", 0.6631: "o", 0.0274: "t"},
  "s": {1.0: " ", 0.2935: "i", 0.1824: "a", 0.3978: "e", 0.5411: "t", 0.0947: "s", 0.1379: "h", 0.053: "u", 0.0224: "p", 0.2328: "o"},
  "r": {1.0: "e", 0.1439: "t", 0.0554: "d", 0.2183: "s", 0.0245: "n", 0.5049: "o", 0.7461: " ", 0.0896: "y", 0.4002: "i", 0.3042: "a"},
  "u": {1.0: "r", 0.5156: "s", 0.2004: " ", 0.3647: "l", 0.259: "p", 0.1475: "c", 0.6674: "n", 0.0476: "e", 0.8267: "t", 0.0963: "g"},
  "t": {0.1525: "a", 0.0368: "u", 1.0: "h", 0.1056: "r", 0.4593: "o", 0.071: "s", 0.3457: "e", 0.7133: " ", 0.0183: "t", 0.243: "i"},
  "w": {0.0373: "s", 0.0059: "l", 0.8036: "a", 1.0: "i", 0.6122: "e", 0.3096: "o", 0.1913: " ", 0.0183: "r", 0.4543: "h", 0.0822: "n"},
  "v": {1.0: "e", 0.007: "s", 0.0014: "d", 0.0737: "o", 0.0234: " ", 0.0029: "r", 0.1484: "a", 0.0112: "y", 0.339: "i", 0.0045: "u"},
  "y": {0.204: "e", 1.0: " ", 0.0681: "i", 0.0136: "l", 0.0314: "t", 0.0223: "m", 0.303: "o", 0.0475: "a", 0.0056: "p", 0.1217: "s"},
  "x": {1.0: "p", 0.7464: " ", 0.0368: "u", 0.2706: "i", 0.1089: "c", 0.0215: "h", 0.01: "o", 0.5265: "t", 0.1895: "e", 0.3517: "i"},
  "z": {1.0: "e", 0.4678: " ", 0.2055: "o", 0.3289: "i", 0.0684: "y", 0.043: "u", 0.0075: "h", 0.024: "l", 0.6314: "a", 0.1182: "z"}
};
// create a sorted list for all keys
for(var key in grams){
  var sorted = [];
  for(var p in grams[key])
      sorted.push(p);
  grams[key].sorted = sorted.sort();
}

function generateWords(n){
  if(!n){
      n = 1;
  }
  var words = [];
  for(var i=0; i<n; i++){
      var w = ' ';
      // last will be our 1gram used to find a proper follower
      var last = w;
      while(true){

          var rand = Math.random();
          var p_list = grams[last].sorted;
          // find the follower corresponding to the random number
          // Note: p_list containes the accumulated probabilities of
          // the followers.
          for(var k=0; k+1 < p_list.length && p_list[k] < rand; k++);

          char = grams[last][p_list[k]];
          if(char === ' '){
              // space indicates end, but we do not want words shorter
              // than 5 so make sure we have minimum length
              if(w.length > 5)
                  break;
          }
          else{
              w += char;
          }
          last = char;
      }
      // strip the leading space before appending to the list
      words.push(w.substring(1));
  }
  return words;
}