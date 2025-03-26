const express = require("express")
const router = express.Router();
const { paymentController } = require("../controllers/index");
// const validate = require("../middleware/validateUser.middleware")

router.post("/create-payment-link", paymentController.createPayment)   

router.post("/receive-hook", paymentController.webHook)


module.exports = router;
