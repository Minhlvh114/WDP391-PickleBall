const express = require("express");
const authController = require("../controllers/auth.controller.js");

const verifyToken = require("../middleware/verifyToken.js");

const router = express.Router();

router.get("/check-auth", verifyToken, authController.checkAuth);
router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/verify-email", authController.verifyemail);
router.post("/forgot-password/send-mail", authController.mailForgotPassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:id", authController.resetPassword);

module.exports = router; 
