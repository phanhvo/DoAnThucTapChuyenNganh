const db = require("../database/db");

// Lấy danh sách đặt phòng
exports.getAllBookings = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM CHITIET_DP");
    return res.json({ success: true, data: results });
  } catch (err) {
    console.error(" Lỗi lấy danh sách đặt phòng:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Thêm đặt phòng và tạo hóa đơn
exports.addBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      MaKH,
      MaPhong,
      NgayNhanPhong,
      NgayTraPhong,
      SoLuongNguoi,
      SoLuongPhong,
      MaQTV,
    } = req.body;

    const kh = MaKH || null;
    const qtv = MaQTV || null;

    if (!kh && !qtv) {
      connection.release();
      return res.status(400).json({ success: false, message: "Bạn cần đăng nhập trước khi đặt phòng!" });
    }

    if (!MaPhong || !NgayNhanPhong || !NgayTraPhong) {
      connection.release();
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    const start = new Date(NgayNhanPhong);
    const end = new Date(NgayTraPhong);
    if (isNaN(start) || isNaN(end) || end <= start) {
      connection.release();
      return res.status(400).json({ success: false, message: "Ngày không hợp lệ" });
    }

    // Lấy thông tin phòng và giá
    const [roomRows] = await connection.query(
      `SELECT P.MaPhong, P.MaLoai, P.SoLuongPhong, LP.GiaPhong
       FROM PHONG P
       JOIN LOAIPHONG LP ON P.MaLoai = LP.MaLoai
       WHERE P.MaPhong = ? LIMIT 1`,
      [MaPhong]
    );

    if (roomRows.length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: "Mã phòng không tồn tại" });
    }

    const room = roomRows[0];

    // Kiểm tra trùng lịch
    const [overlapRows] = await connection.query(
      `SELECT MaDP FROM CHITIET_DP 
       WHERE MaPhong = ? AND NOT (NgayTraPhong <= ? OR NgayNhanPhong >= ?)`,
      [MaPhong, NgayNhanPhong, NgayTraPhong]
    );

    if (overlapRows.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: "Phòng đã được đặt trong khoảng ngày này",
        conflict: overlapRows
      });
    }

    // Sinh mã đặt phòng
    const MaDP = "DP" + Date.now().toString().slice(-10);

    // Insert vào CHITIET_DP
    await connection.query(
      `INSERT INTO CHITIET_DP
       (MaDP, MaKH, MaPhong, NgayNhanPhong, NgayTraPhong, SoLuongNguoi, SoLuongPhong, MaQTV)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [MaDP, kh, MaPhong, NgayNhanPhong, NgayTraPhong, Number(SoLuongNguoi) || 1, Number(SoLuongPhong) || 1, qtv]
    );

    // Tính số đêm
    const soDem = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Tính tổng tiền phòng
    const tongTienPhong = room.GiaPhong * soDem * (Number(SoLuongPhong) || 1);
    const tongTienDV = 0; // hiện chưa có dịch vụ nên tạm để 0
    const tongTien = tongTienPhong + tongTienDV;

    // Sinh mã hóa đơn
    const MaHD = "HD" + Date.now().toString().slice(-10);

    await connection.query(
      `INSERT INTO HOADON
       (MaHD, MaDP, MaKH, MaQTV, SoDem, SoLuongPhong, SoLuongDV, TongTien)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [MaHD, MaDP, kh, qtv, soDem, Number(SoLuongPhong) || 1, 0, tongTien]
    );

    await connection.commit();
    connection.release();

    return res.json({
      success: true,
      message: "Đặt phòng và tạo hóa đơn thành công!",
      MaDP,
      MaHD,
      tongTien
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Lỗi đặt phòng:", err);
    return res.status(500).json({ success: false, message: "Lỗi server khi đặt phòng" });
  }
};
