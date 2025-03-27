const express = require("express");
const router = express.Router();


const {
  getUser,
  getAllUsers,
  getAllMembers,
  updateUser,
  deleteUser,
  changePassword,
  addUser,
} = require('../controllers/user.controller');


router.get("/getAll", (req, res) => getAllUsers(req, res));

router.get("/getAllMembers", (req, res) => getAllMembers(req, res));

router.get("/get/:id", (req, res) => getUser(req, res))

router.put("/update/:id", (req, res) => {
  console.log('Update route called with ID:', req.params.id);
  console.log('Request body:', req.body);
  updateUser(req, res);
});

router.delete("/delete/:id", (req, res) => deleteUser(req, res));

router.post("/change-password", (req, res) => changePassword(req, res));

// Route để thêm user mới
router.post("/add", (req, res) => {
  console.log('Add user request received:', req.body);
  addUser(req, res);
});

module.exports = router;