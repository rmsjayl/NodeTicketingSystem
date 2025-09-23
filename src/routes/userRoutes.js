const express = require("express");
const router = express.Router();

const { getUsers, getUserById, deleteUsers, updateUser } = require("../controllers/userController");

router.route("/").get(getUsers)
router.route("/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUsers)


module.exports = router;