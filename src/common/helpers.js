const bcrypt = require("bcrypt");
const crypt = require("crypto-js");

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
}

module.exports = commonHelpers;