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
          console.log(error);
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
          console.log(error);
        });
    }

    getCreatedTasks = async () => {
      return fetch(`${apiPath}/tasks&?type=created`, {
        headers: await this.getHeaders(),
      })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

    getCreatedTaskSchedules = async () => {
      return fetch(`${apiPath}/schedules?type=created`, {
        headers: await this.getHeaders(),
      })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  getTasksCreatedBySchedule = async (scheduleId) => {
    console.log(`Getting tasks for schedule ${scheduleId}`)
    return fetch(`${apiPath}/schedules/${scheduleId}/tasks`, {
      headers: await this.getHeaders(),
    })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
}

    createTaskSchedule = async (taskSchedule) => {    
      return fetch(`${apiPath}/schedules`, {
          method: 'POST',
          headers: await this.getHeaders(),
          body: JSON.stringify(taskSchedule)
        })
        
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  updateTaskSchedule = async (taskSchedule) => {    
    return fetch(`${apiPath}/schedules/${taskSchedule.id}`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(taskSchedule)
      })
      
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
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
          console.log(error);
        });
    }

    /**
     * Gets a list of available users that you can assign tasks to
     *
     * @memberof TaskService
     */
    getAvailableUsers = async () => {
        return fetch(`${apiPath}/users`, {
          headers: await this.getHeaders(),
        })
        .then(response => response.json())
        .catch((error) => {
          console.log(error);
        });
    }
}