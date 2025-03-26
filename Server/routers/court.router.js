const express = require("express")
const router = express.Router();
const { courtController } = require("../controllers/index");
// const validate = require("../middleware/validateUser.middleware")

router.get("/getAll", courtController.getAllCourts)   

router.get("/get/:id", courtController.getCourt)

router.post("/add", courtController.addCourt)

router.put("/update/:id", courtController.updateCourt)

router.delete("/delete/:id", courtController.deleteCourt)


module.exports = router;
