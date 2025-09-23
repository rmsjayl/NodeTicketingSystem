const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authentication")
const { closeTicket, createTicket, getTickets, getTicketById } = require("../controllers/ticketController");

router
    .route("/")
    .post(createTicket)
    .get(getTickets);
router
    .route("/:id")
    .get(getTicketById)
router
    .route("/:id/close")
    .patch(closeTicket)

module.exports = router;