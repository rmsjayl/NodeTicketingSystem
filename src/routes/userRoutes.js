const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/userController");

router.route("/getUsers").get(getUsers)

module.exports = router;