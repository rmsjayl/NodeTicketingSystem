const commonHelpers = require("../common/helpers");
const User = require("../models/user");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, roles } = req.body;

        console.log(req.body);

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: commonHelpers.passwordHasher(password),
            roles: roles
        });

        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
            role: user.roles
        }

        res.status(commonConstants.STATUS_CODE.CREATED).json({
            success: true,
            message: commonConstants.USER.CREATE.SUCCESS,
            user: userResponse
        })
    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
            success: false,
            message: commonConstants.USER.CREATE.FAILED + error.message
        });
    }
};

exports.login = async (req, res) => {
    res.send("Login route is working...");
};

exports.resetPassword = async (req, res) => {
    res.send("Reset password route is working ...");
};

exports.updatePassword = async (req, res) => {
    res.send("Update password route is working ...");
};

exports.forgotPassword = async (req, res) => {
    res.send("Forgot password route is working ...");
};
