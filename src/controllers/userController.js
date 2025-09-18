const commonConstants = require("../common/constants")
const User = require("../models/user")

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
        const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
        const offset = (page - 1) * limit;

        const { count, rows} = await User.findAndCountAll({
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        const totalPage = Math.ceil(count / limit);

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.USER.RETRIEVE.SUCCESS,
            totalRecords: count,
            pagination: {
                page: `${page} out of ${totalPage}`,
                limit: limit,
            },
            users: rows,
        });

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
            success: false,
            message: commonConstants.USER.RETRIEVE.FAILED + error.message
        })
    }
}

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, roles } = req.body;

        console.log(req.body);

        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
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
}