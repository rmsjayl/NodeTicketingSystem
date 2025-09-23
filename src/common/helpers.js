const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const commonConstants = require("./constants");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const commonHelpers = {
    passwordHasher: function (password) {
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        return bcrypt.hashSync(password, salt, function (error, hash) {
            if (error) {
                return error
            }

            return hash;
        });
    },
    passwordCompare: function (password, hash) {
        return bcrypt.compareSync(password, hash, function (error, result) {
            if (error) {
                return error;
            }

            return result;
        })
    },
    payloadValidation: function (payload) {
        for (let key in payload) {
            if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
                return `${key} is required. ${commonConstants.PAYLOAD_VALIDATION.KEY_NOT_PROVIDED}`
            }
        }
    },
    generateRandomToken: function () {
        return crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
    },
    generateEmailAccessToken: function (email) {
        return jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        });
    },
    generateAccessToken: function (id, roles) {
        return jwt.sign({ id, roles }, process.env.JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        });
    },
    generateRefreshToken: function (email) {
        return jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        });
    },
    generateEmailContent: function (templatePath, user, type) {
        const emailPath = path.join(__dirname, templatePath);
        const source = fs.readFileSync(emailPath, "utf8");
        const template = Handlebars.compile(source);

        const urlMap = {
            [commonConstants.EMAIL_TYPES.ACCOUNT_VERIFICATION]: `/verifyaccount/${user.id}/token/${user.accountVerificationToken}`,
        }

        return template({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            url: `${process.env.BASE_URL}${urlMap[type]}`,
        });
    },
    titleCase: function (str) {
        if (!str) {
            return "";
        }

        return str
            .toLowerCase()
            .split(' ')
            .map(function(word) {
            // For each word, capitalize the first letter and concatenate with the rest in lowercase
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' '); // Join the words back into a single string with spaces
    },
}

module.exports = commonHelpers;