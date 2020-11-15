import {API, Auth} from 'aws-amplify';
import Bank from './bank.model';
import { APIConfiguration } from '../constants/APIConfiguration';

let _bank = {
    coins: 0,
    tickets: 0,
}

const apiPath = new APIConfiguration().getApiHost();

export default class CurrentUserService {
    getHeaders = async () => {
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': await this.getAccessToken(),
        }
        return headers;
      }

    getAccount = async () => {
        return fetch(`${apiPath}/account`, {
            headers: await this.getHeaders(),
          })
          .then((response) => response.json())
          .catch((error) => {
              console.log("Failed to get user:")
            console.log(error);
          });
    }
    getSponsorships = async () => {
      return fetch(`${apiPath}/account/sponsorships`, {
          headers: await this.getHeaders(),
        })
        .then((response) => response.json())
        .catch((error) => {
            console.log("Failed to get sponsorships:")
          console.log(error);
        });
  }

  requestSponsor = async (sponsorId) => {
    console.log(JSON.stringify({
      sponsor_id: sponsorId,
    }))
    return fetch(`${apiPath}/account/sponsorships`, {
        headers: await this.getHeaders(),
        method: "POST",
        body: JSON.stringify({
          sponsor_id: sponsorId,
        })
      })
      .then((response) => response.json())
      .catch((error) => {
          console.log("Failed to request sponsorships:")
        console.log(error);
      });
}

    getBank = async () => {
        return fetch(`${apiPath}/account/bank`, {
            headers: await this.getHeaders(),
          })
          .then((response) => response.json())
          .catch((error) => {
              console.log("Failed to get bank:")
            console.log(error);
          });
    }
    getAccessToken = async () => {
        try {
            const session = await Auth.currentSession();
            accessToken = session.getIdToken().getJwtToken();
            if (__DEV__) {
              console.log("ID TOKEN:")
              console.log(accessToken)
            }
            return accessToken;
        }
        catch(ex) {
            console.log("----- AUTH FAILURE: ------")
            console.log(ex);
        }
    }

    logout = async () => {
        await Auth.signOut();
    }

}