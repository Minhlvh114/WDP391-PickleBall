const express = require("express")
const router = express.Router();
const { bookingController } = require("../controllers/index");
// const validate = require("../middleware/validateUser.middleware")


router.get("/get/:id", bookingController.getBorrow)

router.get("/getAll", bookingController.getAllBorrowers)   

//get all borrower already payment and time rental after current date
router.get("/getAll/date/:courtId", bookingController.getAllBookingsByCourtIdAndCurrentDate)

router.get("/getAll/:courtId", bookingController.getAllBorrowsByCourtId)

router.post("/add", bookingController.addBorrow)

router.put("/update/:id", bookingController.updateBorrow)

router.get("/getAll/user/:userId", bookingController.getAllBorrowersByUserId)

module.exports = router;