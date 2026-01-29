// src/api.js
export const API = "http://localhost:8080/api";

const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role;
};

// Hàm này tránh lỗi bị empty
const safeJson = async (res) => {
    const text = await res.text();
    try {
        return text ? JSON.parse(text) : {};
    } catch {
        return {};
    }
};
// --- PHÒNG ---
export const getRooms = async () => (await fetch(`${API}/phong`)).json();

export const addRoomFull = async (data) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(`${API}/phong/full`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-role": user?.role
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};
export const updateRoomFull = async (MaPhong, data) => {
    if (!MaPhong) throw new Error("Thiếu mã phòng");

    const res = await fetch(`${API}/phong/full/${MaPhong}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-role": getUserRole(),
        },
        body: JSON.stringify(data),
    });

    const result = await safeJson(res);
    if (!res.ok) throw new Error(result.message || "Lỗi cập nhật phòng (full)");
    return result;
};
export const deleteRoom = async (MaPhong) => {
    const res = await fetch(`${API}/phong/${MaPhong}`, {
        method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Không thể xóa phòng");
    }

    return data;
};
export const getAvailableRooms = async (from, to) => {
    const res = await fetch(
        `${API}/phong/trong?from=${from}&to=${to}`
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Lỗi tìm phòng trống");
    return data;
};

// --- KHÁCH HÀNG ---
export const getCustomers = async () => (await fetch(`${API}/khachhang`)).json();

export const getCustomerById = async (MaKH) => {
    const res = await fetch(`${API}/khachhang/${MaKH}`);
    if (!res.ok) throw new Error("Lỗi khi lấy thông tin khách hàng");
    return res.json();
}
export const getCustomerProfile = async (MaKH) => {
    const res = await fetch(`${API}/khachhang/${MaKH}`);

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
        throw new Error(data.message || "Không lấy được thông tin khách hàng");
    }

    return data;
};

export const updateCustomerProfile = async (MaKH, payload) => {
    const res = await fetch(`${API}/khachhang/${MaKH}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
        throw new Error(data.message || "Cập nhật thất bại");
    }

    return data;
};
// --- ĐĂNG NHẬP ---
export const login = async (data) => {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

// --- ĐĂNG KÝ KHÁCH HÀNG ---
export const registerCustomer = async (data) => {
    const res = await fetch(`${API}/khachhang/dangky`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
};

// --- ĐẶT PHÒNG ---
export const addBooking = async ({ MaKH, MaQTV, MaPhong, NgayNhanPhong, NgayTraPhong, SoLuongNguoi, SoLuongPhong }) => {
    const res = await fetch(`${API}/datphong`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            MaKH,
            MaQTV,
            MaPhong,
            NgayNhanPhong,
            NgayTraPhong,
            SoLuongNguoi,
            SoLuongPhong
        }),
    });

    return res.json();
};

// --- HÓA ĐƠN ---
export const getInvoices = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) throw new Error("Chưa đăng nhập");

    let url = `${API}/hoadon`;

    if (user.role === "khachhang") {
        url += `?MaKH=${user.id}`;
    } else if (user.role === "nhanvien") {
        url += `?MaNV=${user.id}`;
    }
    // admin thì không thêm query param

    const res = await fetch(url);
    if (!res.ok) throw new Error("Lỗi khi lấy hóa đơn");
    return res.json();
};

export const addInvoice = async (data) => {
    const res = await fetch(`${API}/hoadon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Lỗi khi thêm hóa đơn");
    return res.json();
};

export const getInvoiceDetails = async (MaHD) => {
    const res = await fetch(`${API}/hoadon/${MaHD}/chitiet`);
    if (!res.ok) throw new Error("Lỗi khi lấy chi tiết hóa đơn");
    return res.json();
};

// --- DOANH THU THEO THÁNG ---
export const getMonthlyRevenue = async () => {
    const res = await fetch(`${API}/hoadon/doanhthu-thang`);
    if (!res.ok) throw new Error("Lỗi khi lấy doanh thu theo tháng");

    const data = await res.json();
    return data.data; // chỉ lấy mảng data
};

// --- THANH TOÁN HÓA ĐƠN ---
// Thanh toán (khách nhấn pay) -> backend sẽ set TrangThai='pending'
export const payInvoice = async (MaHD, phuongThucTT = null, paymentRef = null) => {
    const res = await fetch(`${API}/hoadon/${encodeURIComponent(MaHD)}/pay`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phuongThucTT, paymentRef })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Lỗi khi thanh toán");
    return data;
};
// Nhân viên: xác thực hóa đơn pending -> backend set TrangThai='paid' và ghi MaQTV
export const verifyInvoice = async (MaHD, MaQTV) => {
    const res = await fetch(`${API}/hoadon/${encodeURIComponent(MaHD)}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ MaQTV })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || "Lỗi khi xác thực hóa đơn");

    return data;
};

export const setPaymentMethod = async (MaHD, phuongThucTT) => {
    const res = await fetch(`${API}/hoadon/${encodeURIComponent(MaHD)}/method`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phuongThucTT })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Lỗi khi cập nhật phương thức");
    return data;
};

