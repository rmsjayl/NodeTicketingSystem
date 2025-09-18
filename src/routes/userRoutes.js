const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/userController");

router.route("/get").get(getUsers)

module.exports = router;