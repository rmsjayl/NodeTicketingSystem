const express = require("express");
const router = express.Router();

const { getUsers, deleteUsers } = require("../controllers/userController");

router.route("/get").get(getUsers)
router.route("/delete/:id").delete(deleteUsers)

module.exports = router;