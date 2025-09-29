const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const commonConstants = require("./constants");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const passwordComplexity = require("joi-password-complexity")

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
    checkPayloadValuesForUpdate: function (payload, user) {

        const updates = {};

        for (var payloadKey in payload) {
            const dbKey = payloadKey;
            const newValue = payload[dbKey];

            if (newValue !== undefined && newValue !== null) {

                let trimmedNewValue = typeof newValue === 'string' ? newValue.trim() : newValue;

                if (typeof trimmedNewValue === 'string' && trimmedNewValue.length === 0) {
                    continue;
                }

                updates[dbKey] = trimmedNewValue; // Store payload with values
            }
        }

        if (Object.keys(updates).length === 0) {
            return null;
        }

        return updates;

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
    generateEmailFromTemplate: function (templatePath, receiver, data) {
        const fullTemplatePath = path.join(__dirname, templatePath);
        const source = fs.readFileSync(fullTemplatePath, "utf8");
        const template = Handlebars.compile(source);

        return template({
            data: data,
            user: receiver,
        });
    },
    titleCase: function (str) {
        if (!str) {
            return "";
        }

        return str
            .toLowerCase()
            .split(' ')
            .map(function (word) {
                // For each word, capitalize the first letter and concatenate with the rest in lowercase
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' '); // Join the words back into a single string with spaces
    },
    registerPasswordComplexity: function (password) {
        const complexityOptions = {
            min: 8,
            max: 30,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4,
        };

        const label = "Password";

        if (passwordComplexity(complexityOptions, label).validate(password).error) {
            return passwordComplexity(complexityOptions, label).validate(password).error.message;
        }
    }
}

module.exports = commonHelpers;