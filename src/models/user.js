const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const sequelize = require("../database/db_conn");
const { DataTypes } = require("sequelize");

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
    }
}, {
    timestamps: true,
});

User.afterCreate(async (user) => {
    const token = commonHelpers.generateRandomToken();
    user.accountVerficationToken = token;
    user.accountVerificationExpiry = Date.now() + 30 * 60 * 1000;
    console.log("After create hook")
    commonHelpers.sendVerificationEmail(user.email, token)
});

User.sync({ alter: true })
  .then(() => {
    console.log(commonConstants.DATABASE_TABLES.USER + commonConstants.DATABASE_TABLE_CREATION.SUCCESS);
  })
  .catch((error) => {
    console.error(`${commonConstants.DATABASE_TABLES.USER} ${commonConstants.DATABASE_CONNECTION.ERROR} ${error}`);
  });

module.exports = User