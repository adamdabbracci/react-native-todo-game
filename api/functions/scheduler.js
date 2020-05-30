const TaskScheduleService = require('../services/taskschedule.service');
const TaskService = require('../services/task.service');
const Task = require('../models/task.model');
const taskScheduleService = new TaskScheduleService();
const taskService = new TaskService();

const moment = require("moment");
const rrule = require("rrule");


module.exports.scheduleTasksForNextDay = async (event, context) => {
    const startDateMoment = moment().utc().startOf("day").add(1, "day");
    const activeSchedules = await taskScheduleService.getActiveSchedulesForDate(startDateMoment.unix());

    const tasksToSchedule = [];

    // Check if the RRule matches tomorrow
    activeSchedules.forEach((schedule) => {
      const scheduleRRule = new rrule.rrulestr(schedule.rrule);
      const matchingDates = scheduleRRule.between(moment().utc().startOf("day").toDate(), moment().utc().add(2, "days").startOf("day").toDate());
      const doesMatchTomorrow = matchingDates.map(x => moment(x).toISOString()).indexOf(startDateMoment.toISOString()) > -1;
      console.log(`${schedule.id}} matches: ${doesMatchTomorrow}`)

      if (doesMatchTomorrow) {
        let task = new Task();
        task = schedule.task;
        task.assigned_to = schedule.assigned_to;
        task.created_by = schedule.created_by;
        task.schedule_id = schedule.id;
        tasksToSchedule.push(task);
      }
    })

    for (let index = 0; index < tasksToSchedule.length; index++) {
      await taskService.createTask(tasksToSchedule[index]);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(activeSchedules)
      }
}