import React, { useEffect, useState } from "react";
import { getRooms, getAvailableRooms } from "../api";
import "./css/danhsachphong.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DanhSachPhong() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const [keyword, setKeyword] = useState("");
    const [filterType, setFilterType] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getRooms()
            .then((data) => setRooms(data))
            .catch((err) => console.error("Lỗi khi load phòng:", err));
    }, []);

    const filteredRooms = rooms.filter((p) => {
        const matchKeyword =
            p.MaPhong.toLowerCase().includes(keyword.toLowerCase()) ||
            p.TenLoai.toLowerCase().includes(keyword.toLowerCase());

        const matchType = filterType
            ? p.TenLoai.toLowerCase().includes(filterType.toLowerCase())
            : true;

        return matchKeyword && matchType;
    });
    const formatVND = (money) => {
        return Number(money).toLocaleString("vi-VN");
    };
    const handleSearch = async () => {
        if (!startDate || !endDate) {
            alert("Vui lòng chọn ngày nhận và trả phòng");
            return;
        }

        const from = startDate.toISOString().slice(0, 10);
        const to = endDate.toISOString().slice(0, 10);

        try {
            const data = await getAvailableRooms(from, to);
            setRooms(data);
        } catch (err) {
            alert(err.message);
        }
    };
    return (

        <div className="content">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Nhập thông tin cần tìm kiếm..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Chọn phòng</option>
                    <option value="đơn">Phòng đơn</option>
                    <option value="đôi">Phòng đôi</option>
                    <option value="vip">VIP</option>
                </select>

                <div className="datepicker-box">
                    <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        monthsShown={1}                 //  CHỈ 1 THÁNG
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="📅 Nhận phòng - Trả phòng"
                        popperPlacement="bottom-start"
                    />
                </div>

                <button className="btn-search" onClick={handleSearch}>Tìm</button>
            </div>


            <div className="danhsachphong">
                <h2>Danh sách phòng</h2>

                {/* ===== DANH SÁCH PHÒNG ===== */}
                <div className="room-grid">
                    {filteredRooms.map((p) => (
                        <div
                            className="room-card"
                            key={p.MaPhong}
                            onClick={() => setSelectedRoom(p)}
                        >
                            <div className="room-img">
                                <img
                                    src={`/${p.HinhAnh}`}
                                    alt={p.TenLoai}
                                    onError={(e) =>
                                        (e.currentTarget.src = "/img-default.jpg")
                                    }
                                />
                            </div>

                            <h3>{p.MaPhong} - {p.TenLoai}</h3>
                            <p className="price">
                                Giá: {formatVND(p.GiaPhong)} VNĐ / đêm
                            </p>
                        </div>
                    ))}
                </div>

                {/* ===== CHI TIẾT PHÒNG (HIỆN TRÊN CÙNG TRANG) ===== */}
                {selectedRoom && (
                    <div className="room-detail-overlay">
                        <div className="room-detail">
                            <h3>Chi tiết phòng {selectedRoom.MaPhong}</h3>

                            <div className="detail-content">
                                <img
                                    src={`/${selectedRoom.HinhAnh}`}
                                    alt={selectedRoom.TenLoai}
                                    onError={(e) =>
                                        (e.currentTarget.src = "/img-default.jpg")
                                    }
                                />

                                <div className="detail-info">
                                    <p><b>Loại phòng:</b> {selectedRoom.TenLoai}</p>
                                    <p><b>Mô tả:</b> {selectedRoom.MoTa}</p>
                                    <p>
                                        <b>Giá:</b> {formatVND(selectedRoom.GiaPhong)} VNĐ / đêm
                                    </p>
                                    <p><b>Tình trạng:</b> {selectedRoom.TinhTrangPhong}</p>
                                    <p><b>Số lượng còn:</b> {selectedRoom.SoLuongPhong}</p>

                                    <div className="button-group">
                                        <button
                                            className="btn-dat"
                                            onClick={() =>
                                                window.location.href =
                                                `/datphong?maphong=${selectedRoom.MaPhong}`
                                            }
                                        >
                                            Đặt phòng
                                        </button>

                                        <button
                                            className="btn-close"
                                            onClick={() => setSelectedRoom(null)}
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DanhSachPhong;

