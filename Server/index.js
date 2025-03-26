const express = require("express");
const cors = require("cors");
const logger = require("morgan");
// const session = require("express-session");
const mongoose = require("mongoose");
// const PayOS = require('@payos/node')

// const MongoStore = require('connect-mongo');
// require('./cron');

// Import routers
const routes = require("./routers");
const db = require("./models/index");
const createError = require("http-errors"); // Import http-errors


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// init variable

const app = express();

// const payos = new PayOS("client_id", "api-key", "checksum-key")

app.use(logger("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie:{
//       maxAge: 1000 * 64 * 10,
//       sameSite: 'strict',
//       // secure: true
//     }, 
//       // stringify: false,
//   })
// );





// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: 'Bad method'
//   });
// });

app.use((err, req, res , next) => {
  // console.log(err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.get("/", (req, res) => res.send("Welcome to Court Management System"));



// Implement routes for REST API
app.use("/api/court", routes.courtRouter);
// app.use("/api/schedule", routes.courtRouter);
app.use("/api/bill", routes.billRouter);
app.use("/api/payment", routes.paymentRouter);

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
  console.log("Server listening on port " + process.env.PORT);
  db.connectDB();
});