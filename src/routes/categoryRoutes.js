const express = require("express");

const router = express.Router();
const { authenticate, authorizeRoles } = require("../middlewares/authentication")
const { createCategory, getCategories, getCategoryById, deleteCategoryById, updateCategory } = require("../controllers/categoryController");
const commonConstants = require("../common/constants");

router
    .route("/")
    .get(
        // authenticate,
        // authorizeRoles(
        //     [
        //         commonConstants.USER.ROLES.SUPER_ADMIN
        //     ]
        // ), 
        getCategories
    )
    .post(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ),
        createCategory
    )

router
    .route("/:id")
    .get(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ),
        getCategoryById
    )
    .delete(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ),
        deleteCategoryById
    )
    .put(updateCategory)


module.exports = router;