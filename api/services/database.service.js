const { Sequelize, Model, DataTypes } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('lvlup', 'admin', 'kasjdhfkjahsdlkfjahsdfjwahbjkfb', {
    host: 'lvlup-dev-instance-1.cmmnz9takwky.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',
    
  });

class User extends Model {}
class Task extends Model {}
class Schedule extends Model {}


User.init({
  id: {
      type: DataTypes.STRING,
      primaryKey: true,
  },
  name: DataTypes.STRING,
  email_address: DataTypes.STRING,
  coins: DataTypes.INTEGER
}, { sequelize, modelName: 'user', tableName: 'User', lowercased: true, underscored: true, defaultScope: {
    include: [Task, 
      {
        model: Schedule,
        as: "created_schedules"
      },
      // {
      //   model: Schedule,
      //   as: "schedules"
      // }
    ]
} });


Task.init({
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  coin_reward: DataTypes.INTEGER,
  assigned_to: DataTypes.STRING,
  status: DataTypes.STRING,
  schedule_id: DataTypes.INTEGER,
  assigned_at: DataTypes.DATE,
  completed_at: DataTypes.DATE,
}, { sequelize, modelName: 'task', tableName: 'Task', underscored: true });


Schedule.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    coin_reward: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    rrule: DataTypes.STRING,
    frequency: DataTypes.STRING,
    assigned_to: DataTypes.STRING,
    created_by: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
  }, { sequelize, modelName: 'schedule', tableName: 'Schedule', underscored: true });

  // TaskTemplate.init({
  //   id: {
  //       type: DataTypes.INTEGER,
  //       autoIncrement: true,
  //       primaryKey: true,
  //   },
  //   coin_reward: DataTypes.INTEGER,
  //   assigned_to: DataTypes.STRING,
  //   status: DataTypes.STRING,
  //   schedule_id: DataTypes.INTEGER,
  //   assigned_at: DataTypes.DATE,
  //   completed_at: DataTypes.DATE,
  // }, { sequelize, modelName: 'taskTemplate', tableName: 'TaskTemplate', underscored: true });

// (async () => {
//   await sequelize.sync();
//   const jane = await User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20)
//   });
//   console.log(jane.toJSON());
// })();

User.hasMany(Task, {
    foreignKey: "assigned_to"
})

User.hasMany(Schedule, {
    foreignKey: "created_by",
    as: "created_schedules",
})
User.hasMany(Schedule, {
  foreignKey: "assigned_to",
  as: "schedules",
})

Schedule.hasMany(Task, {
    foreignKey: "schedule_id"
})


// Task.belongsTo(User, {
//     foreignKey: "assigned_to"
// })

const { Op } = require("sequelize");

module.exports = {
    Op,
    User,
    Task,
    Schedule,
}
const init = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      return sequelize;
}
