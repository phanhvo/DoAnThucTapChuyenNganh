const db = require("../database/db");
const { sendInvoiceEmail } = require("../utils/sendInvoiceEmail");
// Đánh dấu hóa đơn pending > 3 ngày là expired 
async function expireOldInvoices() {
  try {
    await db.query(
      `UPDATE HOADON
       SET TrangThai = 'expired'
       WHERE TrangThai = 'pending' AND NgayXuat <= DATE_SUB(NOW(), INTERVAL 3 DAY)`
    );
  } catch (err) {
    console.error("Error expireOldInvoices:", err);
  }
}

// Tạo hóa đơn - chú ý liệt kê cột để tương thích khi thêm cột mới 
exports.createInvoice = async (req, res) => {
  try {
    const {
      MaHD,
      MaDP,
      MaKH = null,
      MaQTV = null,
      SoDem = 1,
      SoLuongPhong = 1,
      SoLuongDV = 0,
      TongTien = 0
    } = req.body;
    const TrangThaiBanDau = "unpaid";
    const sql = `
      INSERT INTO HOADON
        (MaHD, MaDP, MaKH, MaQTV, SoDem, SoLuongPhong, SoLuongDV, TongTien, TrangThai)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [MaHD, MaDP, MaKH, MaQTV, SoDem, SoLuongPhong, SoLuongDV, TongTien, TrangThaiBanDau]);

    // Tạo payment link để frontend hiện QR code chứa lun nội dung hoá đơn
    const paymentLink = `${process.env.PAYMENT_BASE_URL || "http://localhost:3000/payment"}?MaHD=${encodeURIComponent(MaHD)}`;

    return res.json({ success: true, message: "Tạo hóa đơn thành công", MaHD, paymentLink });
  } catch (err) {
    console.error("createInvoice error:", err);
    return res.status(500).json({ success: false, message: err.message || "Lỗi server" });
  }
};

// Lấy tất cả hóa đơn 
exports.getAllInvoices = async (req, res) => {
  try {
    await expireOldInvoices();

    const [rows] = await db.query("SELECT * FROM HOADON");
    return res.json(rows || []);
  } catch (err) {
    console.error("getAllInvoices error:", err);
    return res.status(500).json({ success: false, message: err.message || "Lỗi server" });
  }
};

// Chi tiết hóa đơn 
exports.getInvoiceDetails = async (req, res) => {
  const { MaHD } = req.params;
  try {
    // dùng LEFT JOIN để trả hoá đơn ngay cả khi CHITIET_DP chưa có bản ghi tương ứng
    const [rows] = await db.query(
      `SELECT HOADON.*, CHITIET_DP.NgayNhanPhong, CHITIET_DP.NgayTraPhong
       FROM HOADON
       LEFT JOIN CHITIET_DP ON HOADON.MaDP = CHITIET_DP.MaDP
       WHERE HOADON.MaHD = ?`,
      [MaHD]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("getInvoiceDetails error:", err);
    return res.status(500).json({ success: false, message: err.message || "Lỗi server" });
  }
};
exports.receivePayment = async (req, res) => {
  const { MaHD } = req.params;
  const { phuongThucTT = "tienmat", paymentRef = null } = req.body || {};

  try {
    const [rows] = await db.query("SELECT TrangThai FROM HOADON WHERE MaHD = ? LIMIT 1", [MaHD]);
    const item = Array.isArray(rows) && rows.length ? rows[0] : null;
    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

    if (item.TrangThai === "expired") return res.status(400).json({ success: false, message: "Hóa đơn đã hết hạn" });
    if (item.TrangThai === "paid") return res.status(400).json({ success: false, message: "Hóa đơn đã được thanh toán" });

    // Update payment info và chuyển trạng thái thành 'pending' (chờ nhân viên xác thực)
    await db.query(
      "UPDATE HOADON SET TrangThai = 'pending', PaymentRef = ?, PhuongThucTT = ? WHERE MaHD = ?",
      [paymentRef, phuongThucTT, MaHD]
    );

    return res.json({ success: true, message: "Thanh toán đã được ghi nhận. Vui lòng chờ nhân viên xác thực." });
  } catch (err) {
    console.error("receivePayment error:", err);
    return res.status(500).json({ success: false, message: err.message || "Lỗi server" });
  }
};
exports.verifyPayment = async (req, res) => {
  const { MaHD } = req.params;
  const { MaQTV } = req.body || {};
  if (!MaQTV) {
    return res.status(400).json({ success: false, message: "Thiếu MaQTV" });
  }

  try {
    // 1. Lấy thông tin hóa đơn
    const [hdRows] = await db.query(
      "SELECT MaKH, TrangThai FROM HOADON WHERE MaHD = ?",
      [MaHD]
    );

    if (!hdRows.length) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
    }

    const hd = hdRows[0];

    if (hd.TrangThai !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Hóa đơn không ở trạng thái pending (hiện: ${hd.TrangThai})`
      });
    }

    // 2. Update trạng thái paid
    await db.query(
      "UPDATE HOADON SET TrangThai='paid', MaQTV=?, NgayThanhToan=NOW() WHERE MaHD=?",
      [MaQTV, MaHD]
    );

    // 3. Gửi email nếu có khách hàng
    if (hd.MaKH) {
      const [rows] = await db.query(`
        SELECT 
          h.MaHD, h.MaDP, h.SoDem, h.TongTien,
          c.Email,
          d.NgayNhanPhong, d.NgayTraPhong,d.MaPhong
        FROM HOADON h
        JOIN KHACHHANG c ON h.MaKH = c.MaKH
        JOIN CHITIET_DP d ON h.MaDP = d.MaDP
        WHERE h.MaHD = ?
      `, [MaHD]);

      if (rows.length && rows[0].Email) {
        console.log("Đang gửi mail tới:", rows[0].Email);
        await sendInvoiceEmail(rows[0].Email, rows[0]);
        console.log("Gửi mail thành công");
      } else {
        console.log("Không có email để gửi");
      }
    }

    return res.json({
      success: true,
      message: "Xác thực thành công và đã gửi email hóa đơn",
    });

  } catch (err) {
    console.error("verifyPayment ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xác thực hóa đơn",
      error: err.message,
    });
  }
};
exports.markPaid = async (req, res) => {
  return exports.verifyPayment(req, res);
};

// Thống kê doanh thu theo tháng  
exports.getMonthlyRevenue = async (req, res) => {
  try {
    await expireOldInvoices();

    const sql = `
      SELECT
        YEAR(NgayThanhToan) AS Nam,
        MONTH(NgayThanhToan) AS Thang,
        SUM(TongTien) AS DoanhThu
      FROM HOADON
      WHERE TrangThai = 'paid' AND NgayThanhToan IS NOT NULL
      GROUP BY YEAR(NgayThanhToan), MONTH(NgayThanhToan)
      ORDER BY Nam DESC, Thang DESC
    `;
    const [rows] = await db.query(sql);
    return res.json({ success: true, data: rows || [] });
  } catch (err) {
    console.error("getMonthlyRevenue error:", err);
    return res.status(500).json({ success: false, message: err.message || "Lỗi server" });
  }
};
exports.updatePaymentMethod = async (req, res) => {
  const { MaHD } = req.params;
  const { phuongThucTT } = req.body || {};

  if (!phuongThucTT) return res.status(400).json({ success: false, message: "Thiếu phuongThucTT" });

  try {
    // kiểm tra tồn tại hoá đơn
    const [rows] = await db.query("SELECT TrangThai FROM HOADON WHERE MaHD = ? LIMIT 1", [MaHD]);
    const item = Array.isArray(rows) && rows.length ? rows[0] : null;
    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

    // Nếu hoá đơn đã paid => không cho thay đổi
    if (item.TrangThai === "paid") return res.status(400).json({ success: false, message: "Hóa đơn đã thanh toán, không thể thay đổi phương thức" });

    // Cập nhật PhuongThucTT (không đổi trạng thái)
    await db.query("UPDATE HOADON SET PhuongThucTT = ? WHERE MaHD = ?", [phuongThucTT, MaHD]);

    return res.json({ success: true, message: "Cập nhật phương thức thanh toán thành công", phuongThucTT });
  } catch (err) {
    console.error("updatePaymentMethod error:", err);
    return res.status(500).json({ success: false, message: err.message || "Lỗi server" });
  }
};
