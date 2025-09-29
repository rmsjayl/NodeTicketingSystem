const req = require("express/lib/request");
const commonConstants = require("../common/constants");
const commonHelpers = require("../common/helpers");
const User = require("../models/user");
const sendEmail = require("../utilities/sendEmail");

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

exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ where: { id: userId } })

        if (!user) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: commonConstants.USER.RETRIEVE.NOT_FOUND
            })
        }

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.USER.RETRIEVE.SUCCESS,
            data: user
        })

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
}

exports.deleteUsers = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findOne({ where: { id: id } })

        if (!user) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.USER.RETRIEVE.NOT_FOUND
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

exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, roles, username } = req.body;

    try {

        const payload = { firstName, lastName, roles, username };
        

        // Get a new Date object for the current time
        const now = new Date();

        // Define the formatting options for the date and time
        const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.USER.RETRIEVE.NOT_FOUND
            });
        }

        if (user.firstName === firstName && user.lastName === lastName && user.roles === roles && user.username === username) {
            return res.status(commonConstants.STATUS_CODE.ACCEPTED).json({
                success: true,
                message: commonConstants.USER.UPDATE.NO_CHANGE
            });
        }

        const updates = commonHelpers.checkPayloadValuesForUpdate(payload);

        if (updates === null) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.PAYLOAD_VALIDATION.UPDATE_DETAILS
            });
        }

        await user.update(updates);

        // Send email to notify user of the following account changes
        sendEmail(
            user.email,
            commonConstants.EMAIL_TYPES.CHANGE_ACCOUNT_DETAILS,
            commonConstants.EMAIL_TYPES.CHANGE_ACCOUNT_DETAILS,
            {
                username: user.username,
                date: dateFormatter.format(now),
                time: timeFormatter.format(now),
                changes: updates

            });

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.USER.UPDATE.SUCCESS,
            data: user
        });


    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}