const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const User = require("../models/user")

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
        const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
    

        const { count, rows } = await User.findAndCountAll({
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        const totalPage = Math.ceil(count / limit);

        if (page > totalPage && totalPage > 0) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.PAGINATION.INVALID_PAGE_NUMBER + totalPage
            })
        }

        if (count == 0) {
            return res.status(commonConstants.STATUS_CODE.ACCEPTED).json({
                success: true,
                message: commonConstants.USER.RETRIEVE.NOT_FOUND
            });
        }

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

exports.deleteUsers = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findOne({ where: { id: id } })

        if (!user) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.USER.RETRIEVE.FAILED
            })
        }

        await user.destroy();

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.USER.DELETE.SUCCESS,
            data: user
        })

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}