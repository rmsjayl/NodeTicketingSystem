const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authentication")
const { createTicket, getTickets } = require("../controllers/ticketController");

router
    .route("/")
    .post(authenticate, createTicket)
    .get(authenticate, getTickets);

module.exports = router;