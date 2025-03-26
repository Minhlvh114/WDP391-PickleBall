const mongoose = require("mongoose");
const db = require('../models');
const Bill = db.bill;
const User = db.user;
const { parse, addHours, format, isBefore, isAfter } =  require("date-fns");


const getBill = async (req, res, next) => {
  try {
    const billId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bill ID",
      });
    }

    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    return res.status(200).json({
      success: true,
      bill,
    });
  } catch (err) {
    console.error(err); 
    return next(err);
  }
};

const getAllBills = async (req, res, next) => {
  try {
    const bills = await Bill.find({}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]);
    // const bills = await Bill.find({});
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

const getAllBillsByCourtId = async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const bills = await Bill.find({court_id: courtId}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]);
    // const bills = await Bill.find({});
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


const getAllBillsByCourtIdAndDate = async (req, res, next) => {
  try {
    const courtId = req.params.courtId;
    const currentDate = new Date()

    //lấy list bill
    const bills = await Bill.find({court_id: courtId}).populate("court_id","court_name").populate("user_id", ["email", "phone", "name"]);
    // const bills = await Bill.find({});
    if (!bills.length) {
      return res.status(404).json({
        success: false,
        message: "No bills found"
      });
    }

    //chọn những bill có thời gian thuê sau thời gian thực 
    const newBills = bills.filter( bill => {
      const timeRental = parse(bill.time_rental, "dd/MM/yyyy HH:mm:ss", new Date());
      return isBefore(currentDate, timeRental)
    })
    console.log("newBills: ", newBills)

    return res.status(200).json({
      success: true,
      billList: newBills
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


const addBill = async (req, res, next) => {
  const newBillData = {
    retal_price : req.body.rentalPrice,
    time_rental: req.body.timeRental,
    court_id: req.body.courtId,
    user_id: req.body.userId,
    counter_account_name: req.body.counterAccountName,
    counter_account_number: req.body.counterAccountNumber,
    order_code_pay_os: req.body.orderCodePayOs,
    status: req.body.status,
    transaction_date_time: req.body.transactionDateTime,
    reference_bank: req.body.referenceBank,
  };
  console.log("err")
  console.log(newBillData);
  
  try {
    const newBill = new Bill(newBillData);
    console.log(newBill)
    const savedBill = await newBill.save();

    return res.status(200).json({
      success: true,
      newBill: savedBill,
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


const updateBill = async (req, res, next) => {
  try {
    const billId = req.params.id;
    const updatedBill = req.body;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bill ID",
      });
    }

    const bill = await Bill.findByIdAndUpdate(billId, updatedBill, { new: true, runValidators: true });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedBill: bill,
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

const updateBillByOrderCodePayOS = async (req, res, next) => {
  try {
    
    const orderCode = req.params.orderCode;
    const updatedBill = {
      user_id: req.body.userId,
      court_id: req.body.courtId,
    };
    console.log(updatedBill)
    // const billCheck = await Bill.findOne({ order_code_pay_os: orderCode })



    console.log(123)

    const bill = await Bill.findOneAndUpdate({ order_code_pay_os: orderCode }, updatedBill, { new: true, runValidators: true });
    console.log(123)
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found. Wait few second and reset page",
      });
    }

    return res.status(200).json({
      success: true,
      updatedBill: bill,
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


const deleteBill = async (req, res, next) => {
  try {
    const billId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bill ID",
      });
    }

    const bill = await Bill.findByIdAndDelete(billId);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedBill: bill,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};





const billController = {
  getBill,
  getAllBills,
  addBill,
  updateBill,
  updateBillByOrderCodePayOS,
  getAllBillsByCourtId,
  getAllBillsByCourtIdAndDate,
  deleteBill,
};

module.exports = billController;
