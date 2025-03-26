const express = require("express");
const router = express.Router();


const {
  getUser,
  getAllUsers,
  getAllMembers,
  updateUser,
  deleteUser,
  changePassword,
} = require('../controllers/user.controller');


router.get("/getAll", (req, res) => getAllUsers(req, res));

router.get("/getAllMembers", (req, res) => getAllMembers(req, res));

router.get("/get/:id", (req, res) => getUser(req, res))

router.put("/update/:id", (req, res) => updateUser(req, res));

router.delete("/delete/:id", (req, res) => deleteUser(req, res));

router.post("/change-password", (req, res) => changePassword(req, res));

module.exports = router;
