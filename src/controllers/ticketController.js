const commonHelpers = require("../common/helpers");
const commonConstants = require("../common/constants");
const User = require("../models/user");
const Category = require("../models/category");
const Ticket = require("../models/ticket");

exports.getTickets = async (req, res) => {

    try {
        const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
        const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
        const offset = (page - 1) * limit;

        const { count, rows } = await Ticket.findAndCountAll({
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: ["name"]
                },
                {
                    model: User,
                    as: "user",
                    attributes:["email"]
                }
            ],
            attributes:[
                "id",
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
                success: false,
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
            tickets: rows,
        });

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }

}

exports.createTicket = async (req, res) => {

    const { email, subject, description, priority, categoryId, attachment } = req.body;

    try {
        // 1. Validate payload
        const payload = { email, subject, description, priority, categoryId };
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
                message: "User with the provided email not found."
            });
        }

        // 3. Check if the category exists

        const category = await Category.findByPk(categoryId);

        // const findCategory = await Category.findOne({ where: { name: category }})

        if (!category) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: "Category not found."
            });
        }

        // 4. Create the ticket
        const newTicket = await Ticket.create({
            userId: user.id, // Use the found user's ID
            subject: subject,
            description: description,
            priority: priority,
            categoryId: category.id
            // attachment will be handled by file upload logic (e.g., multer)
        });

        return res.status(commonConstants.STATUS_CODE.CREATED).json({
            success: true,
            message: "Ticket created successfully.",
            ticket: newTicket
        });

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}