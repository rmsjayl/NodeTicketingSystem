const sequelize = require('./db_conn');
const commonConstants = require('../common/constants');

// Import models
const User = require('../models/user');
const Category = require('../models/category');
const Ticket = require('../models/ticket');


async function syncModels() {
  
  await User.sync({ alter: true })
    .then(() => {
      console.log(commonConstants.DATABASE_TABLES.USER + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
    })
    .catch((error) => {
      console.error(`${commonConstants.DATABASE_TABLES.USER} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error.message}`);
    });

  await Ticket.sync({ alter: true })
    .then(() => {
      console.log(commonConstants.DATABASE_TABLES.TICKET + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
    })
    .catch((error) => {
      console.error(`${commonConstants.DATABASE_TABLES.TICKET} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error.message}`);
    });

  await Category.sync({ alter: true })
    .then(() => {
      console.log(commonConstants.DATABASE_TABLES.CATEGORY + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
    })
    .catch((error) => {
      console.error(`${commonConstants.DATABASE_TABLES.CATEGORY} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error.message}`);
    });
}

syncModels();

// --- Define Associations ---

// User <-> Ticket (One-to-Many)
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'userCreatedTicket' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });

// Category <-> Ticket (One-to-Many)
Category.hasMany(Ticket, { foreignKey: 'categoryId', as: 'tickets' });
Ticket.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });


// Export all models and the sequelize instance
const db = {
  sequelize,
  User,
  Category,
  Ticket,
};

module.exports = db;

