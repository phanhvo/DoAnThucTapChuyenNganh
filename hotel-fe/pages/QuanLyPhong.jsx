import React, { useEffect, useState } from "react";
import {
    getRooms,
    deleteRoom,
    addRoomFull,
    updateRoomFull,
} from "../api";
import "./css/quanlyphong.css";

export default function QuanLyPhong() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [rooms, setRooms] = useState([]);
    const [editing, setEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        MaPhong: "",
        TinhTrangPhong: "Trống",
        SoLuongPhong: 1,
        MaLoai: "",
        TenLoai: "",
        MoTa: "",
        GiaPhong: "",
        HinhAnh: "",
    });
    const formatVND = (money) => {
        return Number(money).toLocaleString("vi-VN");
    };

    if (!user || user.role !== "admin") {
        return <h3>Bạn không có quyền truy cập</h3>;
    }

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        const data = await getRooms();
        setRooms(data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({
            MaPhong: "",
            TinhTrangPhong: "Trống",
            SoLuongPhong: 1,
            MaLoai: "",
            TenLoai: "",
            MoTa: "",
            GiaPhong: "",
            HinhAnh: "",
        });
        setEditing(false);
        setShowForm(false);
    };

    const handleEdit = (room) => {
        setForm({
            MaPhong: room.MaPhong,
            TinhTrangPhong: room.TinhTrangPhong,
            SoLuongPhong: room.SoLuongPhong,
            MaLoai: room.MaLoai,
            TenLoai: room.TenLoai || "",
            MoTa: room.MoTa || "",
            GiaPhong: room.GiaPhong || "",
            HinhAnh: room.HinhAnh || "",
        });
        setEditing(true);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.MaPhong || !form.MaLoai) {
            alert("Vui lòng nhập đầy đủ mã phòng và mã loại");
            return;
        }

        try {
            if (editing) {
                await updateRoomFull(form.MaPhong, form);
                alert("Cập nhật phòng thành công");
            } else {
                await addRoomFull(form);
                alert("Thêm phòng thành công");
            }

            resetForm();
            loadRooms();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (MaPhong) => {
        if (!window.confirm("Xóa phòng này?")) return;

        try {
            await deleteRoom(MaPhong);
            alert("Xóa phòng thành công");
            loadRooms();
        } catch (err) {
            alert(err.message); //  ALERT ĐÚNG CÂU BẠN MUỐN
        }
    };
    return (
        <div className="admin-room">
            {/* TOOLBAR */}
            <div className="toolbar">
                <h2>Quản lý phòng (Admin)</h2>
                <button
                    className="btn-add"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    Thêm phòng
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <form className="room-form" onSubmit={handleSubmit}>
                    <h3>{editing ? "Sửa phòng" : "Thêm phòng"}</h3>

                    <div className="form-grid">
                        <input
                            name="MaPhong"
                            placeholder="Mã phòng"
                            value={form.MaPhong}
                            onChange={handleChange}
                            disabled={editing}
                            required
                        />

                        <input
                            type="number"
                            name="SoLuongPhong"
                            min="1"
                            value={form.SoLuongPhong}
                            onChange={handleChange}
                        />

                        <select
                            name="TinhTrangPhong"
                            value={form.TinhTrangPhong}
                            onChange={handleChange}
                        >
                            <option value="Trống">Trống</option>
                            <option value="Đang sử dụng">
                                Đang sử dụng
                            </option>
                        </select>

                        <input
                            name="MaLoai"
                            placeholder="Mã loại (VD: LP01)"
                            value={form.MaLoai}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="TenLoai"
                            placeholder="Tên loại phòng"
                            value={form.TenLoai}
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="GiaPhong"
                            placeholder="Giá / đêm"
                            value={formatVND(form.GiaPhong)}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                setForm({ ...form, GiaPhong: raw });
                            }}
                        />
                    </div>

                    <textarea
                        name="MoTa"
                        placeholder="Mô tả loại phòng"
                        value={form.MoTa}
                        onChange={handleChange}
                    />

                    <input
                        name="HinhAnh"
                        placeholder="Hình ảnh (vd: phongvip.jpg)"
                        value={form.HinhAnh}
                        onChange={handleChange}
                    />

                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            {editing ? "Cập nhật" : "Lưu"}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={resetForm}
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            )}

            {/* TABLE */}
            <table className="room-table">
                <thead>
                    <tr>
                        <th>Mã phòng</th>
                        <th>Loại</th>
                        <th>Giá (VNĐ)</th>
                        <th>Số lượng</th>
                        <th>Tình trạng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((r) => (
                        <tr key={r.MaPhong}>
                            <td>{r.MaPhong}</td>
                            <td>{r.TenLoai}</td>
                            <td className="price">
                                {Number(r.GiaPhong).toLocaleString()}
                            </td>
                            <td>{r.SoLuongPhong}</td>
                            <td>{r.TinhTrangPhong}</td>
                            <td>
                                <div className="action-group">
                                    <button
                                        className="btn-action"
                                        onClick={() => handleEdit(r)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-action"
                                        onClick={() =>
                                            handleDelete(r.MaPhong)
                                        }
                                    >
                                        🗑
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
