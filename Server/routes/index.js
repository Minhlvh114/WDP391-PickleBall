const authRouter = require("./auth.router.js");
const courtRouter = require("./court.router.js");
const userRoutes = require("./user.router.js")
const feedbackRoutes = require("./feedback.router.js")
const paymentRouter = require("./payment.router");
const billRouter = require("./bill.router");
const borrowRouter = require("./borrower.router");
const notiRouter = require("./notification.router");

module.exports = { 
    authRouter,
    courtRouter, 
    userRoutes,
    paymentRouter,
    feedbackRoutes,
    billRouter,
    borrowRouter,
    notiRouter,
};
