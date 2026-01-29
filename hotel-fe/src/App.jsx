import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DanhSachPhong from "../pages/DanhSachPhong";
import DatPhong from "../pages/DatPhong";
import HoaDon from "../pages/HoaDon";
import Login from "../pages/dangnhap";
import DangKy from "../pages/DangKy";
import HoaDonDetail from "../pages/HoadonDetail";
import ThongTinKhachHang from "../pages/ThongTinKhachHang";
import BieuDoDoanhThu from "../pages/BieuDoDoanhThu";
import XuLyHoaDon from "../pages/XuLyHoaDon";
import "./App.css";
import QuanLyPhong from "../pages/QuanLyPhong";
function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className={`app-container ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>

        {/* NÚT TOGGLE */}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <aside className="sidebar">
          <h2 className="logo">🏨 HotelPhuongAnh</h2>
          <nav>
            {!user && <NavLink to="/dangnhap">Đăng nhập</NavLink>}

            {user && (
              <>
                <span className="welcome">Xin chào:<br /> {user.name}</span>
                <button
                  className="logout-btn"
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                >
                  Đăng xuất
                </button>
              </>
            )}
            {user && user.role === "admin" && (
              <NavLink to="/admin/phong">Quản lý phòng</NavLink>
            )}


            {user && user.role === "khachhang" && (
              <NavLink to="/thongtin">Thông tin cá nhân</NavLink>
            )}

            <NavLink to="/" end>Danh sách phòng</NavLink>
            <NavLink to="/datphong">Đặt phòng</NavLink>
            <NavLink to="/hoadon">Hóa đơn</NavLink>

            {user && user.role === "admin" && (
              <NavLink to="/doanhthu-bieudo">Biểu đồ doanh thu</NavLink>
            )}
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/admin/phong" element={<QuanLyPhong />} />
            <Route path="/" element={<DanhSachPhong />} />
            <Route path="/datphong" element={<DatPhong />} />
            <Route path="/hoadon" element={<HoaDon />} />
            <Route path="/dangnhap" element={<Login />} />
            <Route path="/dangky" element={<DangKy />} />
            <Route path="/thongtin" element={<ThongTinKhachHang />} />
            <Route path="/hoadon/:MaHD/chitiet" element={<HoaDonDetail />} />
            <Route path="/doanhthu-bieudo" element={<BieuDoDoanhThu />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;