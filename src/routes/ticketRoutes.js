const express = require("express");

const router = express.Router();

const { createTicket, getTickets } = require("../controllers/ticketController");

router.route("/createTicket").post(createTicket)
router.route("/tickets").get(getTickets)

module.exports = router;