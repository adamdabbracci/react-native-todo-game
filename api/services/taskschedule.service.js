const moment = require("moment");
const rrule = require("rrule");
const { Op, Schedule, Task, User } = require("./database.service");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = class TaskScheduleService {
    getTaskSchedule = async (id) => {
        return Schedule.findByPk(id, {
          include: [Task, User]
        })
      }

      createBulkTasks = async (tasks) => {
        await asyncForEach(tasks, async (task) => {
          try {
            return Task.create(task)
          }
          catch(ex) {
            console.log(`Task for schedule ${task.schedule_id} failed:`)
            console.log(ex)
          }
        })
      }

     /**
      * Returns all schedules that meet a given date
      *
      */
     getActiveSchedulesForDate = async (dateAsMoment) => {

      console.log(dateAsMoment.unix())

        return Schedule.findAll({
          where: {
            [Op.or]: {
              start_date: {
                [Op.lt]: dateAsMoment.unix(),
              },
              end_date: {
                [Op.gt]: dateAsMoment.unix(),
              }
            }
            
          }
        })

        const params = {
          TableName: process.env.TASK_SCHEDULES_TABLE,
        
          FilterExpression: "start_date <= :date AND end_date >= :date", 
          ExpressionAttributeValues: {
            ':date': date,
          }, 
        };

        console.log(params)
        const results = await dynamodb.scan(params).promise();
        return results.Items;
      }

      getTaskSchedulesByCreator = async (userId) => {
        return Schedule.findAll({
          where: {
            created_by: userId
          },
          include: [
            Task,
            User,
          ]
        })
      }

      getTaskSchedulesByAssignedTo = async (userId) => {
        return Schedule.findAll({
          where: {
            assigned_to: userId
          }
        })
      }
    

    createTaskSchedule = async (_taskSchedule) => {

      
      const startMoment =  moment(_taskSchedule.start_date).utc().startOf("day");
      const endMoment = moment(_taskSchedule.end_date).utc().endOf("day");


        // Build an rRule string: http://jakubroztocil.github.io/rrule/
      const newRRule = new rrule.RRule({
        dtstart: startMoment.toDate(),
        until: endMoment.toDate(),
        freq: rrule.RRule[_taskSchedule.frequency],
      });

      try {
        const taskSchedule = Object.assign({}, _taskSchedule);
        taskSchedule.start_date = startMoment.toDate();
        taskSchedule.start_date_string = startMoment.toISOString();
        taskSchedule.end_date = endMoment.toDate();
        taskSchedule.end_date_string = endMoment.toISOString();
        taskSchedule.rrule = newRRule.toString();
        return Schedule.create(taskSchedule)
      }

      catch (ex) {
        console.log("Failed to create schedule:")
        console.log(ex.errors)
        throw new Error(ex);
      }
    }

    updateTaskSchedule = async (id, _taskSchedule) => {

      console.log(`UPDATING ${id}`)
      
      const startMoment =  moment(_taskSchedule.start_date).utc().startOf("day");
      const endMoment = moment(_taskSchedule.end_date).utc().endOf("day");

        // Build an rRule string: http://jakubroztocil.github.io/rrule/
      const newRRule = new rrule.RRule({
        dtstart: startMoment.toDate(),
        until: endMoment.toDate(),
        freq: rrule.RRule[_taskSchedule.frequency],
      });

      try {
        const taskSchedule = Object.assign({}, _taskSchedule);
        taskSchedule.start_date = startMoment.toDate();
        taskSchedule.start_date_string = startMoment.toISOString();
        taskSchedule.end_date = endMoment.toDate();
        taskSchedule.end_date_string = endMoment.toISOString();
        taskSchedule.rrule = newRRule.toString();
        taskSchedule.frequency = _taskSchedule.frequency;

        console.log(taskSchedule)

        await Schedule.update(taskSchedule, {
          where: {
            id: id
          }
        })

        return Schedule.findByPk(id)
      }

      catch (ex) {
        console.log(ex)
        throw new Error(ex);
      }
    }
}