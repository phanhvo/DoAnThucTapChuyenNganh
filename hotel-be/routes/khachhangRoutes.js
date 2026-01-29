const express = require("express");
const router = express.Router();
const khachhangController = require("../controllers/khachhangController");
router.get("/", khachhangController.getAll);
router.post("/", khachhangController.add);
router.post("/dangky", khachhangController.register);
router.put("/:MaKH", khachhangController.update);
router.get("/:MaKH", khachhangController.getById);
module.exports = router;