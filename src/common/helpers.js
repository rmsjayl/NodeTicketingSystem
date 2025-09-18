const bcrypt = require("bcrypt");
const crypto = require("crypto-js");
const commonConstants = require("./constants");

const commonHelpers = {
    passwordHasher: function (password) {
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        return bcrypt.hashSync(password, salt, function(error, hash) {
            if (error) {
                return error
            }

            return hash;
        });
    },
    passwordCompare: function (password, hash){
        return bcrypt.compareSync(password, hash, function (error, result) {
            if (error) {
                return error;
            }

            return result;
        })
    },
    payloadValidation: function (payload) {
        for (let key in payload){
            if(payload[key] === undefined || payload[key] === null || payload[key] === ""){
                return `${key} is required. ${commonConstants.PAYLOAD_VALIDATION.KEY_NOT_PROVIDED}`
            }
        }
    },
    sendVerificationEmail: function (email, token) {
        console.log("Click here to verify your account...")
        console.log(`Sent to email: ${email}`)
        console.log(`Token: ${token}`)
    },
    generateRandomToken: function () {
        return crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
    }
}

module.exports = commonHelpers;