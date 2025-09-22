const jwt = require("jsonwebtoken");
const User = require("../models/user");
const commonConstants = require("../common/constants");

const authenticate = async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
            success: false,
            message: commonConstants.TOKEN.NO_TOKEN
        });
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });

        if (decoded.exp < Date.now() / 1000) {
            return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
                success: false,
                message: commonConstants.TOKEN.TOKEN_EXPIRED
            })
        }

        req.user = await User.findByPk(decoded.id);

        if (!req.user) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: commonConstants.USER.RETRIEVE.NOT_FOUND
            })
        }

        next();

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.UNAUTHORIZED).json({
            success: false,
            message: commonConstants.TOKEN.INVALID
        })
    }
}

module.exports = { authenticate };