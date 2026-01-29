// routes/hoadonRoutes.js
const express = require("express");
const router = express.Router();
const hoadonController = require("../controllers/hoadonController");

// Các route hiện có
router.get("/", hoadonController.getAllInvoices);
router.post("/", hoadonController.createInvoice);
router.get("/:MaHD/chitiet", hoadonController.getInvoiceDetails);
router.get("/doanhthu-thang", hoadonController.getMonthlyRevenue);

// Khách thực hiện nộp chứng từ/submit payment -> set pending
router.put("/:MaHD/pay", hoadonController.receivePayment);

// Nhân viên xác thực thanh toán -> set paid và ghi MaQTV
router.put("/:MaHD/verify", hoadonController.verifyPayment);

// Compatibility: nếu nơi khác gọi markPaid
router.put("/:MaHD/markpaid", hoadonController.markPaid);

module.exports = router;
