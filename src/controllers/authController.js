const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const User = require("../models/user");

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, roles } = req.body;

    try {
        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            roles: roles
        };

        const validation = commonHelpers.payloadValidation(payload);

        if (validation) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: validation
            });
        }

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

        return res.status(commonConstants.STATUS_CODE.CREATED).json({
            success: true,
            message: commonConstants.USER.CREATE.SUCCESS,
            user: userResponse
        })
    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const payload = {
            email: email,
            password: password,
        };

        const validation = commonHelpers.payloadValidation(payload)

        if (validation) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: validation
            });
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.LOGIN.FAILED,
            })
        }

        const isMatch = commonHelpers.passwordCompare(password, user.password);

        if (!isMatch) {
            return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
                success: false,
                message: commonConstants.LOGIN.FAILED,
            });
        }

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.LOGIN.SUCCESS,
        })

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
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
