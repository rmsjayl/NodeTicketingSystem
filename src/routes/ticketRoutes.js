const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authentication")
const { createTicket, getTickets, getTicketById } = require("../controllers/ticketController");

router
    .route("/")
    .post(createTicket)
    .get(getTickets);
router.route("/:id")
    .get(getTicketById)

module.exports = router;