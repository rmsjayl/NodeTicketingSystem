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
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User, // Use table name as a string
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM(
            commonConstants.TOKEN.TYPE.ACCOUNT_VERIFICATION,
            commonConstants.TOKEN.TYPE.FORGOT_PASSWORD),
        allowNull: false,
    },
    dateExpire: {
        type: DataTypes.DATE,
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    dateUsed: {
        type: DataTypes.DATE,
    }

}, {
    timestamps: true,
});

Token.afterCreate(async (token) => {
    const requestToken = commonHelpers.generateRandomToken();
    const expires = Date.now() + 30 * 60 * 1000;

    await token.update({
        token: requestToken,
        dateExpire: expires
    })
        .then(() => console.log(commonConstants.REQUEST_TOKEN.SUCCESS))
        .catch((error) => console.log(commonConstants.REQUEST_TOKEN.FAILED + error.message))


})

module.exports = Token;