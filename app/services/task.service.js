import { Task } from "./task.model";

let tasks = [
    {
        id: 1,
        name: "Take out the trash",
        description: "Task trash out",
        coin_reward: 100,
        ticket_reward: 0,
    },
    {
        id: 2,
        name: "Unload the dishwasher",
        description: "Put everything in it's place and load everything from the sink.",
        coin_reward: 400,
        ticket_reward: 1,
    },
    {
        id: 3,
        name: "Make your bed",
        description: "Tuck in the corners and put the pillows in the right place.",
        coin_reward: 250,
        ticket_reward: 1,
    }
];

export default class TaskService {
    getAll = async () => {
        return new Promise((resolve, reject) => {
            resolve(tasks);
        })
    }

    removeTask = async (taskId) => {
        const taskIndex = tasks.findIndex(x => x.id === taskId);
        if (taskIndex !== -1) {
            console.log("Removing task at index: " + taskIndex);
            tasks.splice(taskIndex, 1);
        }
        return tasks;
    }
}