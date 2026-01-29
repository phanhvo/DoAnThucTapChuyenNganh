import React, { useState } from "react";
import { registerCustomer } from "../api";
import "./css/dangnhap.css";

export default function DangKy() {
    const [form, setForm] = useState({ HoTenKH: "", Email: "", MatKhauKH: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            await registerCustomer(form);
            setMessage("Đăng ký thành công! Bạn có thể đăng nhập.");
        } catch (err) {
            setError(err.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng ký khách hàng</h2>
            <form onSubmit={handleSubmit}>
                <label>Họ tên</label>
                <input name="HoTenKH" value={form.HoTenKH} onChange={handleChange} required />
                <label>Email</label>
                <input name="Email" type="email" value={form.Email} onChange={handleChange} required />
                <label>Mật khẩu</label>
                <input name="MatKhauKH" type="password" value={form.MatKhauKH} onChange={handleChange} required />
                <button type="submit" className="btn-submit">Đăng ký</button>
            </form>
            {message && <div style={{ color: "green", marginTop: 8 }}>{message}</div>}
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
    );
}