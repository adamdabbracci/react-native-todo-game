const TaskScheduleService = require('../services/taskschedule.service');
const TaskService = require('../services/task.service');
const taskScheduleService = new TaskScheduleService();
const taskService = new TaskService();
const task = new TaskService();

const moment = require("moment");
const rrule = require("rrule");


module.exports.scheduleTodaysTasks = async (event, context) => {
    const startDateMoment = moment().utc().startOf("day");
    console.log(`Generating tasks for ${startDateMoment.toString()}`)
    const activeSchedules = await taskScheduleService.getActiveSchedulesForDate(startDateMoment);

    console.log("Active schedules for the date:")
    console.log(activeSchedules)

    const tasksToSchedule = [];

    // Check if the RRule matches tomorrow
    activeSchedules.forEach((schedule) => {
      console.log(`======  START SCHEDULE ${schedule.id} ====== `)
      // build an RRUle from the stored string
      const scheduleRRule = new rrule.rrulestr(schedule.rrule);
      console.log(`RRULE:`);
      console.log(schedule.rrule)
      // Generate dates matching the RRULE +/- 1 day so we don't get f'ed by timezones
      const matchingDates = scheduleRRule.between(startDateMoment.clone().subtract(1, "days").toDate(), startDateMoment.clone().add(1, "days").toDate());
      console.log(`MATCHING DATE:`);
      console.log(matchingDates)
      // Check if the target date matches one of those dates
      const doesMatchToday = matchingDates.map(x => moment(x).toISOString()).indexOf(startDateMoment.toISOString()) > -1;
      console.log(`MATCHES TODAY?: ${doesMatchToday}`);

      // If it matches, generate a new task
      if (doesMatchToday) {
        let task = {}
        task.assigned_to = schedule.assigned_to;
        task.name = schedule.name;
        task.description = schedule.description;
        task.coin_reward = schedule.coin_reward;
        task.status = "Assigned";
        task.created_by = schedule.created_by;
        task.schedule_id = schedule.id;
        task.assigned_date = startDateMoment.toDate();
        console.log("CREATING TASK:")
        console.log(task);
        tasksToSchedule.push(task);
      }
      console.log(`======  END SCHEDULE ${schedule.id} ====== `)

    })

    const scheduleIds = activeSchedules.map(x => x.id)


    try {
      const success = await taskScheduleService.createBulkTasks(tasksToSchedule)
    } catch(ex) {
      console.log(ex)
    }
}