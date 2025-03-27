const mongoose = require("mongoose");
const db = require('../models');
const Borrower = db.borrower;
const User = db.User;
const { parse, addHours, format, isBefore, isAfter, isSameDay } =  require("date-fns");


const getBorrow = async (req, res, next) => {
  try {
    const borrowId = req.params.id;

    console.log(borrowId)

    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrower ID",
      });
    }

    const borrower = await Borrower.findById(borrowId);
    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: "Borrower not found",
      });
    }

    return res.status(200).json({
      success: true,
      borrower,
    });
  } catch (err) {
    console.error(err); 
    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};

const getAllBorrowers = async (req, res, next) => {
  try {
    const bills = await Borrower.find({}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]);
    // const bills = await Borrower.find({});
    if (!bills.length) {
      return res.status(404).json({
        success: false,
        message: "No bills found"
      });
    }

    return res.status(200).json({
      success: true,
      billsList: bills
    });
  } catch (err) {
    console.error(err); 

    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};

const getAllBorrowsByCourtId = async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const bills = await Borrower.find({court_id: courtId}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]);
    // const bills = await Borrower.find({});
    if (!bills.length) {
      return res.status(200).json({
        success: true,
        message: "No bills found",
        // error: "No bills found"
      });
    }

    return res.status(200).json({
      success: true,
      billsList: bills
    });
  } catch (err) {
    console.error(err); 

    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};


const getAllBookingsByCourtIdAndCurrentDate = async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const currentDate = new Date()

    //lấy list borrower
    const bookingList = await Borrower.find({court_id: courtId}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]).populate("bill_id","status");

  

    console.log("bookingList: ", bookingList)

    if (!bookingList.length) {
      return res.status(200).json({
        success: true,
        bookingList: [],
        message: "Bills empty"
      });
    }
    console.log(123)

    //chọn những borrower có thời gian thuê sau thời gian thực và booking đã trả tiền
    const newBookings = bookingList.filter( borrower => {
      //check time_rental in borrower
      // console.log("borrower: ", borrower)
      const timeRental = parse(borrower.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
      if(isBefore(currentDate, timeRental) && borrower.status === "success"){
        return true
      }
      return false
    })
    // console.log("newBookings: ", newBookings)
    console.log(123)
    return res.status(200).json({
      success: true,
      bookingList: newBookings
    });
  } catch (err) {
    console.error(err); 

    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};


const addBorrow = async (req, res, next) => {

  const borrowData = {
    time_rental: req.body.timeRental,
    end_time_rental: req.body.endTimeRental,
    court_id: req.body.courtId,
    bill_id: req.body.billId,
    user_id: req.body.userId,
    status: req.body.status || 'pending', // Default to pending if not provided
  };
  const currentDate = new Date()
  
  const timeRentalData = parse(borrowData.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());

  console.log(timeRentalData)

  try {

    //check time rental before currentDate
    if(isBefore(timeRentalData, currentDate)){
      return res.status(400).json({
        success: false,
        message: "Time rental not validate: Time rental is before current date"
      });
    }

    //get booking by court
    const allBorrow = await Borrower.find({court_id:  borrowData.court_id})
   
    //check duplicate booking
    for(const borrow of allBorrow){
      console.log(borrow)
      const timeBooking = parse(borrow.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
      if(isSameDay(timeBooking, timeRentalData)){
        return res.status(400).json({
          success: false,
          message: "Duplicate booking"
        });
      }
    }

    
    const newBorrow = new Borrower(borrowData);

    
    const savedBorrow = await newBorrow.save();

    return res.status(200).json({
      success: true,
      newBorrow: savedBorrow,
    });
  } catch (err) {
    console.error(err); 
    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};


const updateBorrow = async (req, res, next) => {
  try {

    
    const borrowId = req.params.id;
    const updatedBill = req.body;
    
    const bookingList = await Borrower.find({bill_id: "67d844b8416d72d87be962cf"});

    console.log(bookingList)

    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrower ID",
      });
    }

    const borrower = await Borrower.findByIdAndUpdate(borrowId, updatedBill, { new: true, runValidators: true });

    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: "Borrower not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedBill: borrower,
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    return next(err);
  }
};

// New function specifically for updating booking status
const updateBookingStatus = async (req, res, next) => {
  try {
    const billId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrower ID",
      });
    }

    // Validate the status value
    const validStatuses = ['pending', 'success', 'cancel', 'paid'];
    if (!validStatuses.includes(status?.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Status must be one of: pending, success, cancel, paid",
      });
    }

    // Get the current borrower to check status transitions
    const currentBill = await Borrower.findById(billId);
    
    if (!currentBill) {
      return res.status(404).json({
        success: false,
        message: "Borrower not found",
      });
    }

    // Prevent certain status transitions
    if (currentBill.status?.toLowerCase() === 'cancel' && status !== 'cancel') {
      return res.status(400).json({
        success: false,
        message: "Cannot change status from 'cancel' to another status",
      });
    }

    if ((currentBill.status?.toLowerCase() === 'success' || currentBill.status?.toLowerCase() === 'paid') && status === 'pending') {
      return res.status(400).json({
        success: false,
        message: "Cannot change status from 'success' to 'pending'",
      });
    }

    // Check if the booking time has already passed
    if (currentBill.time_rental) {
      try {
        const timeRental = parse(currentBill.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
        const currentDate = new Date();
        
        if (isAfter(currentDate, timeRental) && status === 'cancel') {
          return res.status(400).json({
            success: false,
            message: "Cannot cancel a booking after its scheduled time",
          });
        }
      } catch (parseErr) {
        console.error('Error parsing date:', parseErr);
      }
    }

    // Update the borrower status
    const updatedBill = await Borrower.findByIdAndUpdate(
      billId, 
      { status }, 
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}' successfully`,
      updatedBill,
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    return next(err);
  }
};

// New function for changing booking details (time or court)
const changeBooking = async (req, res, next) => {
  try {
    const billId = req.params.id;
    const { time_rental, court_id, end_time_rental, retal_price } = req.body;

    console.log('Received change request:', { billId, time_rental, court_id, end_time_rental, retal_price });

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrower ID",
      });
    }

    // Get the current borrower
    const currentBill = await Borrower.findById(billId);
    if (!currentBill) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Prevent changes to cancelled or completed bookings
    if (currentBill.status?.toLowerCase() === 'cancel') {
      return res.status(400).json({
        success: false,
        message: "Cannot modify a cancelled booking",
      });
    }

    // Check if the booking time has already passed
    if (currentBill.time_rental) {
      try {
        const timeRental = parse(currentBill.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
        const currentDate = new Date();
        
        if (isAfter(currentDate, timeRental)) {
          return res.status(400).json({
            success: false,
            message: "Cannot modify a booking after its scheduled time",
          });
        }
      } catch (parseErr) {
        console.error('Error parsing date:', parseErr);
      }
    }

    // Build update object based on what needs to be changed
    const updateData = {};
    
    // Add all provided fields to update data
    if (time_rental) updateData.time_rental = time_rental;
    if (end_time_rental) updateData.end_time_rental = end_time_rental;
    if (court_id) updateData.court_id = court_id;
    if (retal_price) updateData.retal_price = retal_price;
    
    console.log('Update data:', updateData);
    
    // Check and validate time change
    if (time_rental) {
      try {
        // Validate the new time is in the future
        const newTimeRental = parse(time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
        const currentDate = new Date();
        
        if (isAfter(currentDate, newTimeRental)) {
          return res.status(400).json({
            success: false,
            message: "New booking time must be in the future",
          });
        }
      } catch (parseErr) {
        console.error('Error parsing time_rental:', parseErr);
        return res.status(400).json({
          success: false,
          message: "Invalid time format. Expected dd/MM/yyyy HH:mm:ss",
        });
      }
    }
    
    // Check and validate court change
    if (court_id) {
      // Validate court exists
      if (!mongoose.Types.ObjectId.isValid(court_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid court ID",
        });
      }
      
      // Skip court validation for now
      // Just check if it's a valid ObjectId, which we did above
    }
    
    // If no changes requested
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes requested",
      });
    }
    
    // Update the borrower
    const updatedBill = await Borrower.findByIdAndUpdate(
      billId, 
      updateData, 
      { new: true, runValidators: true }
    ).populate("court_id", "court_name").populate("user_id", ["email", "phone", "name"]);
    
    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      updatedBill,
    });
    
  } catch (err) {
    console.error('Error in changeBooking:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    return next(err);
  }
};

const updateBillByOrderCodePayOS = async (req, res, next) => {
  try {
    
    const orderCode = req.params.orderCode;
    const updatedBill = {
      user_id: req.body.userId,
      court_id: req.body.courtId,
    };
    console.log(updatedBill)
    // const billCheck = await Borrower.findOne({ order_code_pay_os: orderCode })

    console.log(123)

    const borrower = await Borrower.findOneAndUpdate({ order_code_pay_os: orderCode }, updatedBill, { new: true, runValidators: true });
    console.log(123)
    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: "Borrower not found. Wait few second and reset page",
      });
    }

    return res.status(200).json({
      success: true,
      updatedBill: borrower,
    });
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    return next(err);
  }
};


const deleteBorrow = async (req, res, next) => {
  try {
    const billId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrower ID",
      });
    }

    const borrower = await Borrower.findByIdAndDelete(billId);

    if (!borrower) {
      return res.status(404).json({
        success: false,
        message: "Borrower not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedBill: borrower,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getAllBorrowersByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const bills = await Borrower.find({user_id: userId})
                           .populate("court_id","court_name")
                           .populate("user_id", ["email", "phone", "name"])
                           .sort({createdAt: -1}); // Sắp xếp theo thời gian tạo mới nhất
    
    if (!bills.length) {
      return res.status(200).json({
        success: true,
        message: "No bills found for this user",
        billsList: []
      });
    }

    return res.status(200).json({
      success: true,
      billsList: bills
    });
  } catch (err) {
    console.error(err); 

    return res.status(err.code || 400).json({
      success: false,
      message: err.message,
      error: err
    });
  }
};



const bookingController = {
  getBorrow,
  getAllBorrowers,
  addBorrow,
  updateBorrow,
  getAllBorrowsByCourtId,
  getAllBookingsByCourtIdAndCurrentDate,
  deleteBorrow,
  getAllBorrowersByUserId
};

module.exports = bookingController;