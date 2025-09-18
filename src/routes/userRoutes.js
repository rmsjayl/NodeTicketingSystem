const express = require("express");
const router = express.Router();

const { getUsers, createUser } = require("../controllers/userController");

router.route("/getUsers").get(getUsers)
router.route("/create").post(createUser)

module.exports = router;