const express = require("express");

const router = express.Router();
const { authenticate, authorizeRoles } = require("../middlewares/authentication")
const { createCategory, getCategories } = require("../controllers/categoryController");
const commonConstants = require("../common/constants");

router.route("/createCategory")
    .post(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ),
        createCategory
    )
router.route("/categories")
    .get(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ), 
        getCategories
    )

module.exports = router;