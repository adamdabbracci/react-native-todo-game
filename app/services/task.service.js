import { Task } from "./task.model";
import { APIConfiguration } from "../constants/APIConfiguration";
import CurrentUserService from "./currentuser.service";
import { User } from "./user.model";

const apiPath = new APIConfiguration().getApiHost();

export default class TaskService {

    

    constructor(){
    }

    currentUserService = new CurrentUserService();
    
    getHeaders = async () => {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': await this.currentUserService.getAccessToken(),
      }
      return headers;
    }


    getAll = async () => {
        console.log(apiPath)
        return fetch(`${apiPath}/tasks`, {
          headers: await this.getHeaders(),
        })
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }

    createTask = async (task) => {    
        return fetch(`${apiPath}/tasks`, {
            method: 'POST',
            headers: await this.getHeaders(),
            body: JSON.stringify(task)
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }

    completeTask = async (task) => {   
        return fetch(`${apiPath}/tasks/${task.id}/complete`, {
            method: 'PUT',
            headers: await this.getHeaders(),
            body: JSON.stringify(task)
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }

    /**
     * Gets a list of available users that you can assign tasks to
     *
     * @memberof TaskService
     */
    getAvailableUsers = async () => {
      console.log(this.headers)

        return fetch(`${apiPath}/users`, {
          headers: await this.getHeaders(),
        })
        .then(async (response) => {
          const cognitoUsers = await response.json();
          const users = cognitoUsers["Users"].map(x => {
            const user = new User();
            user.id = x.Attributes.filter(x => x.Name === "sub")[0].Value;
            user.email = x.Attributes.filter(x => x.Name === "email")[0].Value;
            user.phone = x.Attributes.filter(x => x.Name === "phone_number")[0].Value;
            return user;
          })
          return users;
        })
        .catch((error) => {
          console.error(error);
        });
    }
}