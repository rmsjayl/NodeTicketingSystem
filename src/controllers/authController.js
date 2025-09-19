const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, roles, username } = req.body;

    try {
        const payload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            roles: roles,
            username: username,
        };

        const validation = commonHelpers.payloadValidation(payload);

        if (validation) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: validation
            });
        }

        const userExists = await User.findOne({ where: { email: req.body.email } })

        if (userExists) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.USER.CREATE.ALREADY_EXISTS
            });
        };

        const userNameExists = await User.findOne({ where: { username: req.body.username } });

        if (userNameExists) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.USER.CREATE.ALREADY_EXISTS
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
            username: user.username,
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

    const { username, password } = req.body;

    try {
        const payload = {
            username: username,
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
                username: username
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

exports.googleCallback = (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {

        try {
            if (err || !user) {
                return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                    success: false,
                    message: commonConstants.USER.GOOGLE.AUTHENTICATION.FAILED + err.message,
                });
            }

            const email = user.profile.emails[0].value;
            const firstName = user.profile.name.givenName;
            const lastName = user.profile.name.familyName;

            let authenticatedUser = await User.findOne({
                where: {
                    email: email
                }
            });

            // If the user doesn't exist, create them
            if (!authenticatedUser) {
                authenticatedUser = await User.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: commonHelpers.passwordHasher(commonConstants.USER.GOOGLE.CREDENTIAL.DEFAULT_USER_PASSWORD),
                    roles: commonConstants.USER.GOOGLE.CREDENTIAL.DEFAULT_USER_ROLE
                });
            }

            // Generate application access and refresh tokens (JWTs)
            const accessTokenJWT = commonHelpers.generateAccessToken(email);

            const refreshTokenJWT = commonHelpers.generateRefreshToken(email);

            
            return res.status(commonConstants.STATUS_CODE.OK).json({
                success: true,
                message: commonConstants.USER.GOOGLE.CREATE.SUCCESS,
                data: authenticatedUser,
                accessToken: accessTokenJWT,
                refreshToken: refreshTokenJWT,
            });

        } catch (error) {
            return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }

    })(req, res, next);
};

