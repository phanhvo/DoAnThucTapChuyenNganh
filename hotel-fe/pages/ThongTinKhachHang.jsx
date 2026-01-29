import React, { useState, useEffect } from "react";
import {
    getCustomerProfile,
    updateCustomerProfile
} from "../api";

export default function ThongTinKhachHang() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [form, setForm] = useState({
        HoTenKH: "",
        SDT: "",
        DiaChi: "",
        Email: "",
        CCCD: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // ===== LOAD PROFILE =====
    useEffect(() => {
        if (!user?.id) return;

        getCustomerProfile(user.id)
            .then((data) => {
                setForm({
                    HoTenKH: data.HoTenKH || "",
                    SDT: data.SDT || "",
                    DiaChi: data.DiaChi || "",
                    Email: data.Email || "",
                    CCCD: data.CCCD || "",
                });
            })
            .catch((err) => setMsg("❌ " + err.message));
    }, [user?.id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // ===== UPDATE PROFILE =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);

        try {
            await updateCustomerProfile(user.id, form);
            setMsg("✅ Cập nhật thông tin thành công!");
        } catch (err) {
            setMsg("❌ " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Cập nhật thông tin cá nhân</h2>

            <form onSubmit={handleSubmit}>
                <label>Họ và tên</label>
                <input
                    name="HoTenKH"
                    value={form.HoTenKH}
                    onChange={handleChange}
                    required
                />

                <label>Số điện thoại</label>
                <input
                    name="SDT"
                    value={form.SDT}
                    onChange={handleChange}
                    required
                />

                <label>Địa chỉ</label>
                <input
                    name="DiaChi"
                    value={form.DiaChi}
                    onChange={handleChange}
                    required
                />

                <label>Email</label>
                <input
                    name="Email"
                    value={form.Email}
                    onChange={handleChange}
                    required
                />

                <label>Căn cước công dân</label>
                <input
                    name="CCCD"
                    value={form.CCCD}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
            </form>

            {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
        </div>
    );
}
