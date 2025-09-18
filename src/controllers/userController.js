const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
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