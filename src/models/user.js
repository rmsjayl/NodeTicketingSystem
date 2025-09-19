const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const sequelize = require("../database/db_conn");
const { DataTypes } = require("sequelize");
const sendEmail = require("../utilities/sendEmail");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    accountVerficationToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    accountVerificationExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

User.afterCreate(async (user) => {
    const token = commonHelpers.generateRandomToken();
    const expires = Date.now() + 30 * 60 * 1000;

    await user.update({
        accountVerficationToken: token,
        accountVerificationExpiry: expires,
    })
    .then(() => console.log(commonConstants.USER.UPDATE.SUCCESS))
    .catch((error) => console.log(commonConstants.USER.UPDATE.FAILED + error.message));

    await sendEmail(user.email, commonConstants.SEND_EMAIL.ACCOUNT_VERIFICATION)
    .then(() => console.log(commonConstants.USER.SEND_EMAIL_VERIFICATION.SUCCESS))
    .catch((error) => commonConstants.USER.SEND_EMAIL_VERIFICATION.FAILED + error.message);
});

User.sync({ alter: true })
  .then(() => {
    console.log(commonConstants.DATABASE_TABLES.USER + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
  })
  .catch((error) => {
    console.error(`${commonConstants.DATABASE_TABLES.USER} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error}`);
  });

module.exports = User