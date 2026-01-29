const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import route
const authRoutes = require("./routes/authRoutes");
const datphongRoutes = require("./routes/datphongRoutes");
const khachhangRoutes = require("./routes/khachhangRoutes");
const hoadonRoutes = require("./routes/hoadonRoutes");
const phongRoutes = require("./routes/phongRoutes");

// Dùng route
app.use("/api/auth", authRoutes);
app.use("/api/datphong", datphongRoutes);
app.use("/api/khachhang", khachhangRoutes);
app.use("/api/hoadon", hoadonRoutes);
app.use("/api/phong", phongRoutes);

app.get("/", (req, res) => {
    res.send(" API Quản lý khách sạn đang hoạt động!");
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server đang chạy tại: http://localhost:${PORT}`));