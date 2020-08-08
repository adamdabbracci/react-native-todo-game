const TaskScheduleService = require('../services/taskschedule.service');
const TaskService = require('../services/task.service');
const Task = require('../models/task.model');
const taskScheduleService = new TaskScheduleService();
const taskService = new TaskService();

const moment = require("moment");
const rrule = require("rrule");


module.exports.scheduleTodaysTasks = async (event, context) => {
    const startDateMoment = moment().utc().startOf("day");
    console.log(`Generating tasks for ${startDateMoment.toString()}`)
    const activeSchedules = await taskScheduleService.getActiveSchedulesForDate(startDateMoment.unix());

    console.log("Active schedules for the date:")
    console.log(activeSchedules)

    const tasksToSchedule = [];

    // Check if the RRule matches tomorrow
    activeSchedules.forEach((schedule) => {
      // build an RRUle from the stored string
      const scheduleRRule = new rrule.rrulestr(schedule.rrule);
      console.log(schedule.rrule)
      // Generate dates matching the RRULE +/- 1 day so we don't get f'ed by timezones
      const matchingDates = scheduleRRule.between(startDateMoment.clone().subtract(1, "days").toDate(), startDateMoment.clone().add(1, "days").toDate());
      console.log(matchingDates)
      // Check if the target date matches one of those dates
      const doesMatchTomorrow = matchingDates.map(x => moment(x).toISOString()).indexOf(startDateMoment.toISOString()) > -1;
      console.log(`${schedule.id}} matches: ${doesMatchTomorrow}`)

      // If it matches, generate a new task
      if (doesMatchTomorrow) {
        let task = new Task();
        task = schedule.task;
        task.assigned_to = schedule.assigned_to;
        task.created_by = schedule.created_by;
        task.schedule_id = schedule.id;
        task.assigned_date = startDateMoment.format("MM-DD-YYYY");
        console.log(task);
        tasksToSchedule.push(task);
      }
    })

    for (let index = 0; index < tasksToSchedule.length; index++) {
      const thisTask = tasksToSchedule[index];
      // Delete any tasks that were already scheduled for this schedule
      await taskService.deleteIncompleteTasksByScheduleId(thisTask.schedule_id);
      await taskService.createTask(thisTask);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(activeSchedules)
      }
}