const { Sequelize, Model, DataTypes } = require('sequelize');

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize('lvlup', 'admin', 'kasjdhfkjahsdlkfjahsdfjwahbjkfb', {
  host: 'lvlup-dev-instance-1.cmmnz9takwky.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',

});

class User extends Model { }
class Task extends Model { }
class Schedule extends Model { }
class Sponsorship extends Model { }


User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  username: DataTypes.STRING,
  email_address: DataTypes.STRING,
  coins: DataTypes.INTEGER
}, {
  sequelize, modelName: 'user', tableName: 'User', lowercased: true, underscored: true
});

Sponsorship.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  sponsor_id: DataTypes.UUID,
  sponsee_id: DataTypes.UUID
}, {
  sequelize, modelName: 'sponsorship', tableName: 'Sponsorship', lowercased: true, underscored: true, defaultScope: {
    include: [
      {
        model: User,
        as: "sponsor"
      },
      {
        model: User,
        as: "sponsee"
      }
    ]
  }
});


Task.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  coin_reward: DataTypes.INTEGER,
  assigned_to: DataTypes.UUID,
  status: DataTypes.STRING,
  schedule_id: DataTypes.UUID,
  assigned_at: DataTypes.DATE,
  assigned_date: DataTypes.DATE,
  completed_at: DataTypes.DATE,
}, {
  sequelize, modelName: 'task', tableName: 'Task', underscored: true
});


Schedule.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  coin_reward: DataTypes.INTEGER,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  rrule: DataTypes.STRING,
  frequency: DataTypes.STRING,
  assigned_to: DataTypes.UUID,
  created_by: DataTypes.UUID,
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

Schedule.belongsTo(User, {
  foreignKey: "assigned_to"
})

Task.belongsTo(Schedule)

User.belongsToMany(User, {
  as: "sponsors",
  through: "UserSponsors"
})

User.belongsToMany(User, {
  as: "sponsees",
  through: "UserSponsors"
})

Sponsorship.belongsTo(User, {
  as: "sponsor",
  foreignKey: "sponsor_id"
})


Sponsorship.belongsTo(User, {
  as: "sponsee",
  foreignKey: "sponsee_id"
})


// Task.belongsTo(User, {
//     foreignKey: "assigned_to"
// })

const { Op } = require("sequelize");

const syncDb = async () => {
  await init()
  await sequelize.sync({ force: true });
  return;
}

module.exports = {
  Op,
  User,
  Task,
  Schedule,
  Sponsorship,
  syncDb,
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
