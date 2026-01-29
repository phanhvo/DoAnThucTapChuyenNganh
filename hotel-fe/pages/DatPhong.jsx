import React, { useEffect, useState } from "react";
import { getRooms, addBooking } from "../api";
import "./css/datphong.css";

export default function DatPhong() {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    MaQTV: "",
    MaKH: "",
    MaPhong: "",
    NgayNhanPhong: "",
    NgayTraPhong: "",
    SoLuongNguoi: 1,
    SoLuongPhong: 1,
  });

  useEffect(() => {
    getRooms().then(setRooms).catch((err) => console.error(err));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);

      // admin hoặc nhân viên: gán MaQTV
      if (storedUser.role === "admin" || storedUser.role === "nhanvien") {
        setForm((prev) => ({ ...prev, MaQTV: storedUser.id }));
      }
      // khách hàng: gán MaKH
      if (storedUser.role === "khachhang") {
        setForm((prev) => ({ ...prev, MaKH: storedUser.id }));
      }
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...form };
    if (user.role === "admin" || user.role === "nhanvien") {
      delete payload.MaKH;
    }
    try {
      const res = await addBooking(payload);
      alert(res.message || "Đặt phòng thành công!");

      setForm({
        MaQTV: user.role === "admin" ? user.id : "" || user.role === "nhanvien" ? user.id : "",
        MaKH: user.role === "khachhang" ? user.id : "",
        MaPhong: "",
        NgayNhanPhong: "",
        NgayTraPhong: "",
        SoLuongNguoi: 1,
        SoLuongPhong: 1,
      });
    } catch (err) {
      console.error(err);
      alert("Có lỗi, vui lòng thử lại");
    }
  };

  if (!user) {
    return <p>Bạn cần đăng nhập để đặt phòng</p>;
  }

  return (
    <div className="datphong-container">
      <h2>Đặt phòng</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        {user.role === "admin" && (
          <div className="form-row-full">
            <label>Mã quản trị viên</label>
            <input name="MaQTV" value={form.MaQTV} readOnly />
          </div>
        )}

        {user.role === "nhanvien" && (
          <div className="form-row-full">
            <label>Mã Nhân Viên</label>
            <input name="MaQTV" value={form.MaQTV} readOnly />
          </div>
        )}


        {user.role === "khachhang" && (
          <div>
            <label>Mã khách hàng</label>
            <input name="MaKH" value={form.MaKH} readOnly />
          </div>
        )}

        <div>
          <label>Phòng</label>
          <select name="MaPhong" value={form.MaPhong} onChange={handleChange} required>
            <option value="">-- Chọn phòng --</option>
            {rooms.map((r) => (
              <option key={r.MaPhong} value={r.MaPhong}>
                {r.MaPhong} - {r.TenLoai} ({r.TinhTrangPhong})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Ngày nhận phòng</label>
          <input type="date" name="NgayNhanPhong" value={form.NgayNhanPhong} onChange={handleChange} required />
        </div>

        <div>
          <label>Ngày trả phòng</label>
          <input type="date" name="NgayTraPhong" value={form.NgayTraPhong} onChange={handleChange} required />
        </div>

        <div>
          <label>Số lượng người</label>
          <input type="number" name="SoLuongNguoi" min="1" value={form.SoLuongNguoi} onChange={handleChange} />
        </div>

        <div>
          <label>Số lượng phòng</label>
          <input type="number" name="SoLuongPhong" min="1" value={form.SoLuongPhong} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-submit">Đặt phòng</button>
      </form>
    </div>
  );
}
