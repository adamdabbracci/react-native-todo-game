const moment = require("moment");
const rrule = require("rrule");
const { Op, Schedule, Task } = require("./database.service");

module.exports = class TaskScheduleService {
    getTaskSchedule = async (id) => {
        return Schedule.findByPk(id)
      }

      createBulkTasks = async (tasks) => {
        console.log(tasks)
        return Task.bulkCreate(tasks)
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
          }
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
        const taskSchedule = Object.assign(new TaskSchedule(), _taskSchedule);
        taskSchedule.start_date = startMoment.toDate();
        taskSchedule.start_date_string = startMoment.toISOString();
        taskSchedule.end_date = endMoment.toDate();
        taskSchedule.end_date_string = endMoment.toISOString();
        taskSchedule.rrule = newRRule.toString();
        console.log(taskSchedule)
        return Schedule.create(taskSchedule)
      }

      catch (ex) {
        console.log(ex)
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
        const taskSchedule = Object.assign(new TaskSchedule(), _taskSchedule);
        taskSchedule.start_date = startMoment.toDate();
        taskSchedule.start_date_string = startMoment.toISOString();
        taskSchedule.end_date = endMoment.toDate();
        taskSchedule.end_date_string = endMoment.toISOString();
        taskSchedule.rrule = newRRule.toString();
        taskSchedule.frequency = _taskSchedule.frequency;
        taskSchedule.task = Object.assign({}, _taskSchedule.task)

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