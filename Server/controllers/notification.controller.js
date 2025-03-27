const mongoose = require("mongoose");
const db = require('../models');
const Notification = db.notification;
const User = db.User;
const { parse, addHours, format, isBefore, isAfter, isSameDay } =  require("date-fns");



const getAllNoti = async (req, res, next) => {
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

// const getNotiByUserId = async (req, res, next) => {
//   try {
//     const courtId = req.params.courtId;
//     const bills = await Borrower.find({court_id: courtId}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]);
//     // const bills = await Borrower.find({});
//     if (!bills.length) {
//       return res.status(200).json({
//         success: true,
//         message: "No bills found",
//         // error: "No bills found"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       billsList: bills
//     });
//   } catch (err) {
//     console.error(err); 

//     return res.status(err.code || 400).json({
//       success: false,
//       message: err.message,
//       error: err
//     });
//   }
// };




const addNoti = async (req, res, next) => {

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


const updateNoti = async (req, res, next) => {
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





const deleteNoti = async (req, res, next) => {
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

const getAllNotiByUserId = async (req, res, next) => {
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



const notiController = {
    getAllNoti,
    // getNotiByUserId,
    addNoti,
    updateNoti,
    deleteNoti,
    getAllNotiByUserId,
};

module.exports = notiController;