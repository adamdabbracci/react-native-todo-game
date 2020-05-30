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
    getAccessToken = async () => {
        try {
            const session = await Auth.currentSession();
            accessToken = session.getAccessToken().getJwtToken();
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