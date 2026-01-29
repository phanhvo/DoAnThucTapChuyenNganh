import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div style={{ width: 200, background: '#333', color: '#fff', minHeight: '100vh', padding: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>🏨 Hotel</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: 16 }}>
                    <Link to="/rooms" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Phòng</Link>
                </li>
                <li style={{ marginBottom: 16 }}>
                    <Link to="/customers" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Khách hàng</Link>
                </li>
                <li style={{ marginBottom: 16 }}>
                    <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Đăng nhập khách hàng</Link>
                </li>
                <li style={{ marginBottom: 16 }}>
                    <Link to="/admin-login" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Đăng nhập quản trị</Link>
                </li>
                <li style={{ marginBottom: 16 }}>
                    <Link to="/doanhthu-bieudo" style={{ color: '#fff', textDecoration: 'none', fontSize: 16 }}>Biểu đồ doanh thu</Link>
                </li>
            </ul>
        </div>
    );
}