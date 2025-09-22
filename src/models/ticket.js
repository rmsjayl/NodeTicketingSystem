const commonConstants = require("../common/constants");
const sequelize = require("../database/db_conn");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Category = require("./category");

const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    subject:
    {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryId:
    {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM(
            commonConstants.TICKET.PRIORITY.HIGH, 
            commonConstants.TICKET.PRIORITY.MEDIUM, 
            commonConstants.TICKET.PRIORITY.LOW),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(
            commonConstants.TICKET.STATUS.OPEN, 
            commonConstants.TICKET.STATUS.IN_PROGRESS, 
            commonConstants.TICKET.STATUS.CLOSED),
        allowNull: false,
    },
    attachment:{
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    timestamps: true,
});

Ticket.belongsTo(User, { foreignKey: 'userId' });
Ticket.belongsTo(Category, { foreignKey: 'categoryId' });

Ticket.sync({ alter: true })
  .then(() => {
    console.log(commonConstants.DATABASE_TABLES.TICKET + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
  })
  .catch((error) => {
    console.error(`${commonConstants.DATABASE_TABLES.TICKET} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error}`);
  });

module.exports = Ticket;