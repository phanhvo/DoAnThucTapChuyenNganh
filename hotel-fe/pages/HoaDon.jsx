import React, { useEffect, useState } from "react";
import { getInvoices, verifyInvoice } from "../api";
import { useNavigate } from "react-router-dom";
import "./css/hoadon.css";

export default function HoaDon() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const loadInvoices = async (user) => {
    try {
      const allInvoices = await getInvoices();

      let filtered = [];
      if (user.role === "khachhang") {
        // Khách chỉ thấy hóa đơn của họ
        filtered = allInvoices.filter(hd => hd.MaKH === user.id);
      } else if (user.role === "nhanvien") {
        filtered = allInvoices.filter(hd => {
          return hd.TrangThai === "pending" || hd.MaQTV === user.id;
        });
      } else if (user.role === "admin") {
        filtered = allInvoices;
      }

      setInvoices(filtered);
    } catch (error) {
      console.error("Lỗi load hóa đơn:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/dangnhap");
      return;
    }
    loadInvoices(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewDetails = (hd) => {
    navigate(`/hoadon/${hd.MaHD}/chitiet`);
  };

  const handleVerify = async (hd) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Bạn cần đăng nhập nhân viên");
      return;
    }
    if (!(user.role === "nhanvien" || user.role === "admin")) {
      alert("Bạn không có quyền xác thực");
      return;
    }

    if (hd.TrangThai !== "pending") {
      alert("Hóa đơn không ở trạng thái chờ xác thực.");
      return;
    }

    if (!window.confirm(`Xác nhận hoá đơn ${hd.MaHD} đã được thanh toán bởi khách?`)) return;

    try {
      const res = await verifyInvoice(hd.MaHD, user.id);
      alert(res.message || "Xác thực thành công");
      // reload danh sách
      loadInvoices(user);
    } catch (err) {
      console.error("Lỗi xác thực:", err);
      alert(err.message || "Xác thực thất bại");
    }
  };
  const formatVND = (money) => {
    return Number(money).toLocaleString("vi-VN");
  };

  return (
    <div className="hoadon-container">
      <h2 className="tieudehd">Danh sách hóa đơn</h2>

      {invoices.length === 0 ? (
        <p>Chưa có hóa đơn nào.</p>
      ) : (
        <div className="hoadon-table-wrapper">
          <table className="hoadon-table">
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Mã khách hàng</th>
                <th>Mã nhân viên</th>
                <th>Mã đặt phòng</th>
                <th>Số đêm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((hd) => (
                <tr key={hd.MaHD}>
                  <td data-label="Mã hóa đơn">{hd.MaHD}</td>
                  <td data-label="Mã khách hàng">{hd.MaKH}</td>
                  <td data-label="Mã nhân viên">{hd.MaQTV || "-"}</td>
                  <td data-label="Mã đặt phòng">{hd.MaDP}</td>
                  <td data-label="Số đêm">{hd.SoDem}</td>
                  <td data-label="Tổng tiền">
                    {formatVND(hd.TongTien)} VNĐ
                  </td>
                  <td data-label="Trạng thái">{hd.TrangThai}</td>
                  <td data-label="Hành động">
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        className="btnxemchitiet"
                        onClick={() => viewDetails(hd)}
                      >
                        Xem chi tiết
                      </button>

                      {(() => {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        if (
                          (user.role === "nhanvien" || user.role === "admin") &&
                          hd.TrangThai === "pending"
                        ) {
                          return (
                            <button
                              className="btn-xacnhan"
                              onClick={() => handleVerify(hd)}
                            >
                              Xác nhận
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
