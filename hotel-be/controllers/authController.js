const db = require("../database/db");
function mapChucVuToRole(tenCV) {
  if (!tenCV) return "nhanvien";
  const s = String(tenCV).toLowerCase();
  if (s.includes("admin")) return "admin";
  if (s.includes("nhan")) return "nhanvien";
  return "nhanvien";
}
exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu" });
  }

  try {
    //  Kiểm tra QUANTRIVIEN (admin / nhân viên)
    const [qtvRows] = await db.query(
      `SELECT q.MaQTV AS Ma, q.HoTen AS HoTen, q.Email AS Email, q.MatKhauQTV AS MatKhau, c.TenCV AS TenCV
       FROM QUANTRIVIEN q
       LEFT JOIN CHUCVU c ON q.MaCV = c.MaCV
       WHERE q.Email = ? LIMIT 1`,
      [email]
    );

    if (qtvRows && qtvRows.length > 0) {
      const r = qtvRows[0];
      const dbPass = r.MatKhau || r.MatKhauQTV || r.MatKhauNV;
      if (dbPass === password) {
        // Lấy chức vụ và chuẩn hóa
        const chucVu = r.TenCV ? r.TenCV.charAt(0).toUpperCase() + r.TenCV.slice(1).toLowerCase() : "Nhanvien";
        return res.json({
          user: {
            Ma: r.Ma,
            HoTen: r.HoTen,
            ChucVu: chucVu, // Để frontend điều hướng
            role: mapChucVuToRole(r.TenCV), // Để phân quyền
          },
          message: "Đăng nhập thành công (quản trị viên/nhân viên)",
        });
      }
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    //  Kiểm tra KHACHHANG
    const [khRows] = await db.query(
      `SELECT MaKH AS Ma, HoTenKH AS HoTen, Email, MatKhauKH AS MatKhau
       FROM KHACHHANG
       WHERE Email = ? LIMIT 1`,
      [email]
    );

    if (khRows && khRows.length > 0) {
      const r = khRows[0];
      const dbPass = r.MatKhau || r.MatKhauKH;
      if (dbPass === password) {
        return res.json({
          user: {
            Ma: r.Ma,
            HoTen: r.HoTen,
            ChucVu: "Khachhang", // Để frontend điều hướng
            role: "khachhang",
          },
          message: "Đăng nhập thành công (khách hàng)",
        });
      }
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    //  Không tìm thấy user
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập" });
  }
};