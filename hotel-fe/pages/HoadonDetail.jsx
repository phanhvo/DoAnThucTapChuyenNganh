import React, { useEffect, useState } from "react";
import { getInvoiceDetails, setPaymentMethod, payInvoice } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import "./css/HoadonDetail.css";

export default function HoaDonDetail() {
    const { MaHD } = useParams();
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");
    const [phuongThuc, setPhuongThuc] = useState("tienmat");
    const [loadingPay, setLoadingPay] = useState(false);
    const [savingMethod, setSavingMethod] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MaHD]);

    const loadDetail = async () => {
        try {
            const data = await getInvoiceDetails(MaHD);
            const obj = Array.isArray(data) ? data[0] : data;
            setDetail(obj || null);
            if (obj && obj.PhuongThucTT) setPhuongThuc(obj.PhuongThucTT);
            setError("");
        } catch (err) {
            setError(err.message || "Lỗi khi tải chi tiết");
            setDetail(null);
        }
    };

    // Khi KH thay phương thức, lưu ngay vào DB (không set pending)
    const handleMethodChange = async (value) => {
        setPhuongThuc(value);
        // Nếu chưa có detail (bizarre), vẫn attempt save
        try {
            setSavingMethod(true);
            await setPaymentMethod(MaHD, value);
            // reload detail để đồng bộ hiển thị (PhuongThucTT, ...).
            await loadDetail();
        } catch (err) {
            console.error("Lỗi lưu phương thức:", err);
            alert(err.message || "Lỗi khi lưu phương thức thanh toán");
        } finally {
            setSavingMethod(false);
        }
    };

    const handlePayment = async () => {
        if (!detail) return;
        if (detail.TrangThai === "pending" || detail.TrangThai === "paid") {
            alert("Hóa đơn đã được nộp/đã thanh toán.");
            return;
        }

        const paymentRef = phuongThuc === "qr"
            ? `QR_REF_${Date.now()}`
            : (phuongThuc === "vidientu" ? `WALLET_REF_${Date.now()}` : null);

        try {
            setLoadingPay(true);
            const res = await payInvoice(MaHD, phuongThuc, paymentRef);
            if (res.success) {
                alert(res.message || "Thanh toán đã được ghi nhận (chờ nhân viên xác thực).");
                await loadDetail();
            } else {
                alert(res.message || "Thanh toán thất bại");
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Lỗi khi gửi thanh toán");
        } finally {
            setLoadingPay(false);
        }
    };

    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!detail) return <div>Đang tải chi tiết hóa đơn...</div>;

    // LẤY user từ localStorage để phân quyền hiển thị control
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isStaffOrAdmin = user && (user.role === "nhanvien" || user.role === "admin");
    const selectDisabled = isStaffOrAdmin || detail.TrangThai === "pending" || detail.TrangThai === "paid";
    const formatVND = (money) => {
        return Number(money).toLocaleString("vi-VN");
    };
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };
    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="hoadon-detail-container">
            <h2>Chi tiết hóa đơn #{MaHD}</h2>
            <table>
                <tbody>
                    <tr><td><b>Mã hóa đơn:</b></td><td>{detail.MaHD}</td></tr>
                    <tr><td><b>Mã khách hàng:</b></td><td>{detail.MaKH}</td></tr>
                    <tr><td><b>Mã nhân viên:</b></td><td>{detail.MaQTV || "-"}</td></tr>
                    <tr><td><b>Mã đặt phòng:</b></td><td>{detail.MaDP}</td></tr>
                    <tr><td><b>Số đêm:</b></td><td>{detail.SoDem}</td></tr>
                    <tr><td><b>Ngày nhận phòng:</b></td><td>{formatDate(detail.NgayNhanPhong)}</td></tr>
                    <tr><td><b>Ngày trả phòng:</b></td><td>{formatDate(detail.NgayTraPhong)}</td></tr>
                    <tr><td><b>Ngày xuất hoá đơn:</b></td><td>{formatDateTime(detail.NgayXuat)}</td></tr>
                    <tr><td><b>Trạng thái:</b></td><td>{detail.TrangThai}</td></tr>
                    <tr><td><b>Tổng tiền:</b></td><td>{formatVND(detail.TongTien)} VNĐ</td></tr>

                    <tr>
                        <td><b>Phương thức thanh toán:</b></td>
                        <td>
                            <select
                                value={phuongThuc}
                                onChange={(e) => handleMethodChange(e.target.value)}
                                disabled={selectDisabled || savingMethod}
                            >
                                <option value="tienmat">Tiền mặt</option>
                                <option value="qr">QRCode</option>
                                <option value="vidientu">Ví điện tử</option>
                            </select>

                            {savingMethod && <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>Đang lưu phương thức...</div>}
                            {detail.PhuongThucTT && <div style={{ marginTop: 6 }}>Đã chọn: <b>{detail.PhuongThucTT}</b></div>}
                        </td>
                    </tr>
                </tbody>
            </table>


            <div style={{ marginTop: 16 }}>
                <div style={{ marginTop: 16 }}>
                    {/* Nếu hóa đơn chưa pending/paid, và:
                            - là khách hàng (user.role === "khachhang")
                            - hoặc là nhân viên và hóa đơn KHÔNG có MaKH (đặt giùm)
                        */}
                    {(detail.TrangThai !== "pending" && detail.TrangThai !== "paid") && (
                        (user && user.role === "khachhang") ||
                        (user && user.role === "nhanvien" && !detail.MaKH) || (user && user.role === "admin" && !detail.MaKH)
                    ) && (
                            <button className="btn-pay" onClick={handlePayment} disabled={loadingPay}>
                                {loadingPay ? "Đang xử lý..." : "Thanh toán"}
                            </button>
                        )}

                    {detail.TrangThai === "pending" && (
                        <button className="btn-disabled" disabled>Đã nộp, chờ nhân viên xác thực</button>
                    )}

                    {detail.TrangThai === "paid" && (
                        <button className="btn-disabled" disabled>Đã thanh toán</button>
                    )}
                </div>
            </div>

            <button className="btn-back" onClick={() => navigate(-1)}>← Quay lại</button>

        </div>
    );
}
