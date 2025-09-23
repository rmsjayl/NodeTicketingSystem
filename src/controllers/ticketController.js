const commonHelpers = require("../common/helpers");
const commonConstants = require("../common/constants");
const User = require("../models/user");
const Category = require("../models/category");
const Ticket = require("../models/ticket");
const { Sequelize } = require('sequelize')


exports.getTickets = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
        const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        const status = req.query.status || commonConstants.TICKET.STATUS.OPEN;
        const roles = req.user.roles;

        // Variable where
        var whereClause = {}
        whereClause.status = commonHelpers.titleCase(status);

        // Filter based on user roles
        if (roles == commonConstants.USER.ROLES.AGENT) {
            whereClause.assignedTo = req.user.id;
        }

        const { count, rows } = await Ticket.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["name"]
                },
                {
                    model: User,
                    as: "userCreatedTicket", // User who created the ticket
                    attributes: [
                        "email",
                        [Sequelize.literal(`"userCreatedTicket"."firstName" || ' ' || "userCreatedTicket"."lastName"`), "fullName"]
                    ]
                },
                {
                    model: User,
                    as: "assignedToUser", // User assigned ticket
                    attributes: [
                        "email",
                        [Sequelize.literal(`"assignedToUser"."firstName" || ' ' || "assignedToUser"."lastName"`), "fullName"]
                    ]
                }
            ],
            attributes: [
                "id",
                "assignedTo",
                "subject",
                "description",
                "priority",
                "status",
                "attachment",
                "createdAt",
                "updatedAt"
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
            where: whereClause
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
                message: commonConstants.TICKET.RETRIEVE.NOT_FOUND
            });
        }

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.TICKET.RETRIEVE.SUCCESS,
            totalRecords: count,
            pagination: {
                page: `${page} out of ${totalPage}`,
                limit: limit,
            },
            tickets: rows,
        });

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }

}

exports.getTicketById = async (req, res) => {
    const ticketId = req.params.id;

    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: commonConstants.TICKET.RETRIEVE.FAILED
            })
        }

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.TICKET.RETRIEVE.SUCCESS,
            data: ticket
        })
    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

exports.createTicket = async (req, res) => {

    const { assignedTo, email, subject, description, priority, categoryId, attachment } = req.body;

    try {
        // 1. Validate payload
        const payload = { assignedTo, email, subject, description, priority, categoryId };
        const validationError = commonHelpers.payloadValidation(payload);

        if (validationError) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: validationError
            });
        }

        // 2. Find the user by email to get their ID
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: commonConstants.USER.RETRIEVE.NOT_FOUND
            });
        }

        // 3. Check if the category exists
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: commonConstants.CATEGORY.RETRIEVE.NOT_FOUND
            });
        }

        // 4. Create the ticket
        const newTicket = await Ticket.create({
            userId: user.id, // Use the found user's ID
            assignedTo: assignedTo,
            subject: subject,
            description: description,
            priority: priority,
            categoryId: category.id
            // attachment will be handled by file upload logic (e.g., multer)
        });

        return res.status(commonConstants.STATUS_CODE.CREATED).json({
            success: true,
            message: commonConstants.TICKET.CREATE.SUCCESS,
            ticket: newTicket
        });

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

exports.closeTicket = async (req, res) => {
    const ticketId = req.params.id;

    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.TICKET.RETRIEVE.FAILED
            })
        }
        if (ticket.status == commonConstants.TICKET.STATUS.CLOSED) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: commonConstants.TICKET.UPDATE.FAILED +
                    commonConstants.TICKET.ERROR_MESSAGE.TICKET_ALREADY_CLOSED
            })
        }
        await ticket.update({
            status: commonConstants.TICKET.STATUS.CLOSED,
        });
        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.TICKET.UPDATE.SUCCESS,
            data: ticket
        })
    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}