const mongoose = require("mongoose");
const db = require('../models');
const Court = db.court;

const getCourt = async (req, res, next) => {
  try {
    const courtId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courtId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid court ID",
      });
    }

    const court = await Court.findById(courtId);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    return res.status(200).json({
      success: true,
      court,
    });
  } catch (err) {
    console.error(err); 
    return next(err);
  }
};

const getAllCourts = async (req, res, next) => {
  try {
    const courts = await Court.find({});
    if (!courts.length) {
      return res.status(404).json({
        success: false,
        message: "No courts found"
      });
    }

    return res.status(200).json({
      success: true,
      courtsList: courts
    });
  } catch (err) {
    console.error(err); 

    if (err.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: "Service unavailable. Please try again later.",
        error: err.message
      });
    }
    if (err.name === 'MongoError') {
      return res.status(500).json({
        success: false,
        message: "An error occurred with the database.",
        error: err.message
      });
    }
    return res.status(400).json({
      success: false,
      message: "An error occurred while retrieving the courts.",
      error: err.message
    });
  }
};


const addCourt = async (req, res, next) => {
  try {
    const newCourtData = {
      court_name : req.body.courtName,
      price: req.body.price,
      courts_photo: req.body.photoUrl,
      // pageUrls: req.body.pageUrls || [],
      status: req.body.status || "active",
    };

    console.log(newCourtData);

    const newCourt = new Court(newCourtData);
    console.log(newCourt)
    const savedCourt = await newCourt.save();

    return res.status(201).json({
      success: true,
      newCourt: savedCourt,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: err.message,
      });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate key error",
        error: err.message,
      });
    }
    return next(err);
  }
};


const updateCourt = async (req, res, next) => {
  try {
    const courtId = req.params.id;
    const updatedCourt = req.body;

    if (!mongoose.Types.ObjectId.isValid(courtId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid court ID",
      });
    }

    const court = await Court.findByIdAndUpdate(courtId, updatedCourt, { new: true, runValidators: true });

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedCourt: court,
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


const deleteCourt = async (req, res, next) => {
  try {
    const courtId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courtId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid court ID",
      });
    }

    const court = await Court.findByIdAndDelete(courtId);

    if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedCourt: court,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};





const courtController = {
  getCourt,
  getAllCourts,
  addCourt,
  updateCourt,
  deleteCourt,
};

module.exports = courtController;
