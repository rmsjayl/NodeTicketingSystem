const commonConstants = require("../common/constants");
const sequelize = require("../database/db_conn");
const { DataTypes } = require("sequelize");
const User = require("../models/user");
const Category = require("../models/category");

const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User, // Use table name as a string
            key: 'id'
        }
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Category, // Use table name as a string
            key: 'id'
        }
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
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
        defaultValue: commonConstants.TICKET.STATUS.OPEN,
        allowNull: false,
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
});


module.exports = Ticket;