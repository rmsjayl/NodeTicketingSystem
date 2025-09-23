const express = require("express");
const router = express.Router();

const { getUsers, deleteUsers, updateUser } = require("../controllers/userController");

router.route("/").get(getUsers)
router.route("/:id")
    .put(updateUser)
    .delete(deleteUsers)


module.exports = router;