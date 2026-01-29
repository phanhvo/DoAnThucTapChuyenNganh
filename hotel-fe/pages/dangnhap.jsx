import React, { useState } from "react";
import { login } from "../api";
import "./css/dangnhap.css";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(form);

        if (res.user) {
            //  Lưu user vào localStorage
            localStorage.setItem("user", JSON.stringify({
                id: res.user.Ma,
                name: res.user.HoTen,
                role: res.user.ChucVu.toLowerCase(), // => lưu vào localStorage dưới dạng chữ thường
            }));

            alert(`Đăng nhập thành công! Xin chào ${res.user.HoTen}`);

            //  Điều hướng theo quyền
            if (res.user.ChucVu === "Admin") {
                window.location.href = "/Admin";
            } else if (res.user.ChucVu === "Nhanvien") {
                window.location.href = "/Nhanvien";
            } else {
                window.location.href = "/";
            }
        }
        else {
            {
                alert(res.message || "Đăng nhập thất bại");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng nhập </h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>Mật khẩu</label>
                <div className="input-group password-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        aria-label="Mật khẩu"
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-pressed={showPassword}
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        {showPassword ? (
                            /* eye-off icon (simplified, neutral color) */
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10.58 10.58A3 3 0 0013.42 13.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.27 12.3A15.92 15.92 0 019 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.53 16.11A9.94 9.94 0 0112 17.5c-5 0-9-4.5-9-5s1.73-2.5 4.13-3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            /* eye icon (simplified, neutral color) */
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
                <a className="forgot-password" href="/quenmatkhau">Quên mật khẩu?</a>

                <button type="submit" className="btn-submit">Đăng nhập</button>
                <a className="register-link" href="/dangky">Chưa có tài khoản? Đăng ký</a>
            </form>
        </div>
    );
}