const db = require("../database/db");

// Dùng để kiểm tra quyền admin
function isAdmin(req, res) {
  const role = req.headers["x-role"];
  if (role !== "admin") {
    res.status(403).json({ message: "Chỉ admin mới có quyền thao tác" });
    return false;
  }
  return true;
}

// Lấy tất cả phòng cùng loại phòng
exports.getAllRooms = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT P.MaPhong, P.TinhTrangPhong, P.SoLuongPhong,
             LP.MaLoai, LP.TenLoai, LP.GiaPhong, LP.MoTa, LP.HinhAnh
      FROM PHONG P
      JOIN LOAIPHONG LP ON P.MaLoai = LP.MaLoai
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllRooms:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách phòng" });
  }
};

// Xoá phòng theo mã phòng
exports.deleteRoom = async (req, res) => {
  const { MaPhong } = req.params;

  try {
    //  Kiểm tra phòng có người ở / có lịch đặt không
    const [rows] = await db.query(
      "SELECT 1 FROM CHITIET_DP WHERE MaPhong = ? LIMIT 1",
      [MaPhong]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Phòng này còn người ở hoặc đã có lịch đặt, không thể xoá",
      });
    }

    //  Nếu không có lịch đặt → cho xoá
    await db.query("DELETE FROM PHONG WHERE MaPhong = ?", [MaPhong]);

    return res.json({ message: "Xóa phòng thành công" });
  } catch (err) {
    console.error("deleteRoom:", err);
    return res.status(500).json({
      message: "Lỗi server khi xoá phòng",
    });
  }
};

// Thêm phòng cùng loại phòng (nếu chưa có)
exports.addRoomWithLoai = async (req, res) => {
  if (!isAdmin(req, res)) return;

  const { MaPhong, MaLoai, TenLoai, GiaPhong, MoTa, HinhAnh } = req.body;
  if (!MaPhong || !MaLoai) {
    return res.status(400).json({ message: "Thiếu mã phòng hoặc mã loại" });
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const [existPhong] = await conn.query(
      "SELECT MaPhong FROM PHONG WHERE MaPhong = ?",
      [MaPhong]
    );
    if (existPhong.length > 0) {
      throw new Error("Mã phòng đã tồn tại");
    }

    const [existLoai] = await conn.query(
      "SELECT MaLoai FROM LOAIPHONG WHERE MaLoai = ?",
      [MaLoai]
    );

    if (existLoai.length === 0) {
      if (!TenLoai || !GiaPhong) {
        throw new Error("Thiếu thông tin loại phòng");
      }
      await conn.query(
        `INSERT INTO LOAIPHONG (MaLoai, TenLoai, MoTa, GiaPhong, HinhAnh)
         VALUES (?, ?, ?, ?, ?)`,
        [MaLoai, TenLoai, MoTa || null, GiaPhong, HinhAnh || null]
      );
    }

    await conn.query(
      `INSERT INTO PHONG (MaPhong, TinhTrangPhong, SoLuongPhong, MaLoai)
       VALUES (?, 'Trống', 1, ?)`,
      [MaPhong, MaLoai]
    );

    await conn.commit();
    res.json({ message: "Thêm phòng thành công" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("addRoomWithLoai:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// Cập nhật phòng cùng loại phòng
exports.updateRoomWithLoai = async (req, res) => {
  if (!isAdmin(req, res)) return;

  const { MaPhong } = req.params;
  const { MaLoai, TenLoai, GiaPhong, MoTa, HinhAnh, TinhTrangPhong, SoLuongPhong } = req.body;

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    await conn.query(
      `UPDATE LOAIPHONG
       SET TenLoai = COALESCE(?, TenLoai),
           GiaPhong = COALESCE(?, GiaPhong),
           MoTa = COALESCE(?, MoTa),
           HinhAnh = COALESCE(?, HinhAnh)
       WHERE MaLoai = ?`,
      [TenLoai, GiaPhong, MoTa, HinhAnh, MaLoai]
    );

    await conn.query(
      `UPDATE PHONG
       SET TinhTrangPhong = ?, SoLuongPhong = ?
       WHERE MaPhong = ?`,
      [TinhTrangPhong || "Trống", SoLuongPhong || 1, MaPhong]
    );

    await conn.commit();
    res.json({ message: "Cập nhật phòng thành công" });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("updateRoomWithLoai:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// Tìm phòng trống trong khoảng ngày từ from đến to
exports.getAvailableRooms = async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to || new Date(from) >= new Date(to)) {
    return res.status(400).json({ message: "Ngày không hợp lệ" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT p.MaPhong, p.TinhTrangPhong, p.SoLuongPhong,
             lp.MaLoai, lp.TenLoai, lp.GiaPhong, lp.MoTa, lp.HinhAnh
      FROM PHONG p
      JOIN LOAIPHONG lp ON p.MaLoai = lp.MaLoai
      WHERE p.MaPhong NOT IN (
        SELECT MaPhong FROM CHITIET_DP
        WHERE NOT (NgayTraPhong <= ? OR NgayNhanPhong >= ?)
      )
      `,
      [from, to]
    );

    res.json(rows);
  } catch (err) {
    console.error("getAvailableRooms:", err);
    res.status(500).json({ message: "Lỗi tìm phòng trống" });
  }
};