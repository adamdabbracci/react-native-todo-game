import { Task } from "./task.model";
import { APIConfiguration } from "../constants/APIConfiguration";

const apiPath = new APIConfiguration().getApiHost() + "/tasks";

export default class TaskService {
    getAll = async () => {
        console.log(apiPath)
        return fetch(`${apiPath}`)
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }

    createTask = async (task) => {    
        return fetch(`${apiPath}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
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
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
          })
          
        .then((response) => response.json())
        .catch((error) => {
          console.error(error);
        });
    }
}