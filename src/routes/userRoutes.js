const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middlewares/authentication")
const { getUsers, getUserById, deleteUsers, updateUser } = require("../controllers/userController");
const commonConstants = require("../common/constants");

router.route("/")
    .get(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN,
                commonConstants.USER.ROLES.ADMIN
            ]
        ),
        getUsers
    )
router.route("/:id")
    .get(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN,
                commonConstants.USER.ROLES.ADMIN
            ]
        ),
        getUserById)
    .put(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN,
                commonConstants.USER.ROLES.ADMIN
            ]
        ),
        updateUser)
    .delete(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN,
                commonConstants.USER.ROLES.ADMIN
            ]
        ), 
        deleteUsers
    )


module.exports = router;