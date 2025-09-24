const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const { DataTypes } = require("sequelize");
const sequelize = require("../database/db_conn");
const User = require("../models/user");

const Token = sequelize.define("Token", {

    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId:{
        type: DataTypes.UUID,
        references: {
            model: User, // Use table name as a string
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(
            commonConstants.TOKEN.TYPE.ACCOUNT_VERIFICATION,
            commonConstants.TOKEN.TYPE.FORGOT_PASSWORD),
        allowNull: false,
    },
    dateExpire: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    dateUsed: {
        type: DataTypes.DATE,
        allowNull: true,
    }
    
}, {
    timestamps: true,
});

module.exports = Token;