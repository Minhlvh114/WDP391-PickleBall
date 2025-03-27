const courtController = require('./court.controller');
const paymentController = require('./payment.controller');
const feedbackController = require("./feedback.controller")
const billController = require('./bill.controller');
const bookingController = require("./borrower.controller")
const notiController = require("./notification.controller")

module.exports = {
    courtController,
    paymentController,
    feedbackController,
    billController,
    bookingController,
    notiController,
}