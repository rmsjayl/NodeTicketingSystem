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
    dateVerified: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

User.afterCreate(async (user) => {

    const url = `${process.env.BASE_URL}/api/auth/verify/${user.id}/token/${user.accountVerficationToken}`
    
    await sendEmail(
        user.email,
        commonConstants.EMAIL_TYPES.ACCOUNT_VERIFICATION,
        commonConstants.SEND_EMAIL.ACCOUNT_VERIFICATION,
        { username: user.username, url: url })
        .then(() => console.log(commonConstants.USER.SEND_EMAIL_VERIFICATION.SUCCESS))
        .catch((error) => commonConstants.USER.SEND_EMAIL_VERIFICATION.FAILED + error.message);
});

module.exports = User