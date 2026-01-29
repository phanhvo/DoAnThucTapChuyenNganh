const db = require("../database/db");

// Lấy tất cả khách hàng
exports.getAll = (req, res) => {
  db.query("SELECT * FROM KHACHHANG", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
exports.add = (req, res) => {
  const { MaKH, HoTenKH, GioiTinh, NgSinh, SDT, Email, CCCD, DiaChi, NgayDK, LoaiKhach } = req.body;
  const sql = "INSERT INTO KHACHHANG VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [MaKH, HoTenKH, GioiTinh, NgSinh, SDT, Email, CCCD, DiaChi, NgayDK, LoaiKhach], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Thêm khách hàng thành công!" });
  });
};
exports.register = async (req, res) => {
  const { HoTenKH, Email, MatKhauKH } = req.body;
  try {
    const [exist] = await db.query("SELECT * FROM KHACHHANG WHERE Email = ?", [Email]);
    if (exist.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Tạo mã khách hàng tự động (ví dụ: KH + 6 số ngẫu nhiên)
    const MaKH = "KH" + Math.floor(100000 + Math.random() * 900000);

    await db.query(
      "INSERT INTO KHACHHANG (MaKH, HoTenKH, Email, MatKhauKH) VALUES (?, ?, ?, ?)",
      [MaKH, HoTenKH, Email, MatKhauKH]
    );
    res.json({ message: "Đăng ký thành công", MaKH });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
exports.update = async (req, res) => {
  const { MaKH } = req.params;
  const { HoTenKH, SDT, DiaChi, Email } = req.body;
  try {
    await db.query(
      "UPDATE KHACHHANG SET HoTenKH=?, SDT=?, DiaChi=?, Email=? WHERE MaKH=?",
      [HoTenKH, SDT, DiaChi, Email, MaKH]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
exports.getById = (req, res) => {
  const { MaKH } = req.params;
  db.query("SELECT * FROM KHACHHANG WHERE MaKH = ?", [MaKH], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result || result.length === 0) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(result[0]);
  });
};