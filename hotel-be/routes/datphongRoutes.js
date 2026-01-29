const express = require("express");
const router = express.Router();
const datphongController = require("../controllers/datphongController");

// Lấy danh sách đặt phòng
router.get("/", datphongController.getAllBookings);

// Tạo chi tiết đặt phòng
router.post("/", datphongController.addBooking);

module.exports = router;