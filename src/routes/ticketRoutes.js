const express = require("express");
const router = express.Router();

const { authenticate, authorizeRoles } = require("../middlewares/authentication")
const upload = require("../middlewares/handleAttachments");
const limitFileSize = require("../middlewares/limitFileSize");
const validateImage = require("../middlewares/imageValidator");
const { closeTicket, createTicket, getTickets, getTicketById } = require("../controllers/ticketController");
const commonConstants = require("../common/constants");

router
    .route("/")
    .post(
        authenticate,
        upload.single("attachment"),
        validateImage, 
        limitFileSize,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.SUPER_ADMIN,
                commonConstants.USER.ROLES.AGENT
            ]
        ),
        createTicket
    )
    .get(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.ADMIN,
                commonConstants.USER.ROLES.SUPER_ADMIN,
                commonConstants.USER.ROLES.AGENT
            ]
        ),
        getTickets
    );
router
    .route("/:id")
    .get(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.ADMIN,
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ),
        getTicketById
    )
router
    .route("/:id/close")
    .patch(
        authenticate,
        authorizeRoles(
            [
                commonConstants.USER.ROLES.ADMIN,
                commonConstants.USER.ROLES.SUPER_ADMIN
            ]
        ),
        closeTicket
    )

module.exports = router;