const express = require("express");
const router = express.Router();
const { notiController } = require("../controllers/index");

router.get("/getAll", notiController.getAllNoti);
router.get("/getAll/:id", notiController.getAllNotiByUserId);
router.post("/add", notiController.addNoti);
router.put("/update/:id", notiController.updateNoti);
router.delete("/delete/:id", notiController.deleteNoti);

module.exports = router; // Use module.exports instead of export default
