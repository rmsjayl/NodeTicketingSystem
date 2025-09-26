const commonHelpers = require("../common/helpers");
const commonConstants = require("../common/constants");
const Category = require("../models/category"); // Import models from index.js
const req = require("express/lib/request");

exports.createCategory = async (req, res) => {

    const { name, details } = req.body;

    try {

        const payload = { name, details };
        const validationError = commonHelpers.payloadValidation(payload);

        if (validationError) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: validationError
            });
        }

        const newCategory = await Category.create({
            name: name, // Use the found user's ID
            details: details,
        });

        return res.status(commonConstants.STATUS_CODE.CREATED).json({
            success: true,
            message: commonConstants.CATEGORY.CREATE.SUCCESS,
            category: newCategory
        });


    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

exports.getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || commonConstants.PAGINATION.PAGE;
        const limit = parseInt(req.query.limit) || commonConstants.PAGINATION.LIMIT;
        const offset = (page - 1) * limit;


        const { count, rows } = await Category.findAndCountAll({
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
                message: commonConstants.CATEGORY.RETRIEVE.NOT_FOUND
            });
        }

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.RETRIEVE.SUCCESS,
            totalRecords: count,
            pagination: {
                page: `${page} out of ${totalPage}`,
                limit: limit,
            },
            categories: rows,
        });

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        })
    }
}

exports.getCategoryById = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                succes: false,
                message: commonConstants.CATEGORY.RETRIEVE.NOT_FOUND
            });
        }

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.RETRIEVE.SUCCESS,
            data: category
        })

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.RETRIEVE.SUCCESS,
            totalRecords: count,
            pagination: {
                page: `${page} out of ${totalPage}`,
                limit: limit,
            },
            categories: rows,
        });
    }
}

exports.deleteCategoryById = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                succes: false,
                message: commonConstants.CATEGORY.RETRIEVE.NOT_FOUND
            });
        }

        await category.destroy();

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.RETRIEVE.SUCCESS,
            data: category
        })

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.RETRIEVE.SUCCESS,
            totalRecords: count,
            pagination: {
                page: `${page} out of ${totalPage}`,
                limit: limit,
            },
            categories: rows,
        });
    }
}

exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const { name, details } = req.body;

    try {

        const payload = { name, details };
        const validatedInputs = commonHelpers.payloadValidation(payload);

        if (validatedInputs) {
            return res.status(commonConstants.STATUS_CODE.BAD_REQUEST).json({
                success: false,
                message: validatedInputs
            });
        }

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(commonConstants.STATUS_CODE.NOT_FOUND).json({
                success: false,
                message: commonConstants.CATEGORY.RETRIEVE.NOT_FOUND
            })
        }

        if (category.name === name && category.details === details) {
            return res.status(commonConstants.STATUS_CODE.ACCEPTED).json({
                success: false,
                message: commonConstants.CATEGORY.UPDATE.NO_CHANGE
            })
        }

        //Update the category

        await category.update({
            name: name,
            details: details
        })

        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.UPDATE.SUCCESS,
            data: category
        })

    } catch (error) {
        return res.status(commonConstants.STATUS_CODE.OK).json({
            success: true,
            message: commonConstants.CATEGORY.RETRIEVE.SUCCESS,
            totalRecords: count,
            pagination: {
                page: `${page} out of ${totalPage}`,
                limit: limit,
            },
            categories: rows,
        });
    }
}