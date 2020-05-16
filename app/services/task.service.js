import { Task } from "./task.model";
import { APIConfiguration } from "../constants/APIConfiguration";
import CurrentUserService from "./currentuser.service";

const apiPath = new APIConfiguration().getApiHost() + "/tasks";

export default class TaskService {

    headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    constructor(){
      this.getAuthorization();
    }

    getAuthorization = async () => {
      this.headers["Authorization"] = `Bearer ${await this.currentUserService.getAccessToken()}`;
    }

    currentUserService = new CurrentUserService();


    getAll = async () => {
        console.log(apiPath)
        return fetch(`${apiPath}`, {
          headers: this.headers,
        })
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }

    createTask = async (task) => {    
        return fetch(`${apiPath}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(task)
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }

    completeTask = async (task) => {   
      console.log(`${apiPath}/${task.id}/complete`) 
        return fetch(`${apiPath}/${task.id}/complete`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(task)
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }
}