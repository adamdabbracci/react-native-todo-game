import { APIConfiguration } from "../constants/APIConfiguration";
import CurrentUserService from "./currentuser.service";


const apiPath = new APIConfiguration().getApiHost();
const currentUserService = new CurrentUserService();

export default class UserService {
    getHeaders = async () => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': await currentUserService.getAccessToken(),
        }
        return headers;
    }

    searchUsersByUsername = async (username) => {    
        return fetch(`${apiPath}/users?username=${username}`, {
            method: 'GET',
            headers: await this.getHeaders(),
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.log(error);
        });
    }

    getUser = async (userId) => {    
        return fetch(`${apiPath}/users/${userId}`, {
            method: 'GET',
            headers: await this.getHeaders(),
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.log(error);
        });
    }
}