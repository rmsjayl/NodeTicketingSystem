const express = require("express");

const router = express.Router();

const { register, login, resetPassword, updatePassword, forgotPassword, googleCallback } = require("../controllers/authController");

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/resetPassword/:id").get(resetPassword)
router.route("/updatePassword").put(updatePassword)
router.route("/forgotPassword").post(forgotPassword)
router.route("/googleCallback").get(googleCallback)

module.exports = router;