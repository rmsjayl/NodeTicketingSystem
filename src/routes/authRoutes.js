const express = require("express");
const router = express.Router();

const {
    register,
    login,
    accountVerification,
    forgotPassword,
    resetPassword,
    googleCallback,
} = require("../controllers/authController");

router
    .route("/register")
    .post(register);

router
    .route("/login")
    .post(login);

router
    .route("/verify/:id/token/:token")
    .get(accountVerification);

router
    .route("/forgotPassword")
    .post(forgotPassword);

router
    .route("/resetPassword/:tokenId/user/:userId")
    .post(resetPassword);

router
    .route("/googleCallback")
    .get(googleCallback);

module.exports = router;