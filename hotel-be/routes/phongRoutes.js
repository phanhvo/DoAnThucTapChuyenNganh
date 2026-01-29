const express = require("express");
const router = express.Router();
const phongController = require("../controllers/phongController");

router.get("/trong", phongController.getAvailableRooms);
router.post("/full", phongController.addRoomWithLoai);
router.put("/full/:MaPhong", phongController.updateRoomWithLoai);
router.get("/", phongController.getAllRooms);
router.delete("/:MaPhong", phongController.deleteRoom);

module.exports = router;