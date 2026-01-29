import React, { useEffect, useState } from 'react';
export default function XuLyHoaDon() {
    const [hoaDon, setHoaDon] = useState(null);
    const [form, setForm] = useState({
        MaHoaDon: '',
        TinhTrang: '',
    });

    useEffect(() => {
        const fetchHoaDon = async () => {
            const id = localStorage.getItem('hoaDonId');
            if (id) {
                try {
                    const data = await getHoaDonById(id);
                    setHoaDon(data);
                    setForm({
                        MaHoaDon: data.MaHoaDon,
                        TinhTrang: data.TinhTrang,
                    });
                } catch (error) {
                    console.error('Error fetching Hoa Don:', error);
                }
            }
        };
        fetchHoaDon();
    }, []);
    return (
        <div className="xulyhoadon-container">
            <h2 className="tieudexulyhd">Xử Lý Hóa Đơn</h2>
            {hoaDon ? (
                <form className="formxulyhd">
                    <div className="form-group">
                        <label>Mã Hóa Đơn:</label>
                        <input type="text" value={form.MaHoaDon} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Tình Trạng:</label>
                        <select
                            value={form.TinhTrang}
                            onChange={(e) => setForm({ ...form, TinhTrang: e.target.value })}
                        >
                            <option value="Chưa xử lý">Chưa xử lý</option>
                            <option value="Đã xử lý">Đã xử lý</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        className="btnxulyhd"
                        onClick={async () => {
                            try {
                                await updateHoaDon(form.MaHoaDon, { TinhTrang: form.TinhTrang });
                                alert('Cập nhật hóa đơn thành công!');
                            } catch (error) {
                                console.error('Error updating Hoa Don:', error);
                                alert('Cập nhật hóa đơn thất bại!');
                            }
                        }}
                    >
                        Cập Nhật Hóa Đơn
                    </button>
                </form>
            ) : (
                <p>Đang tải hóa đơn...</p>
            )}
        </div>
    );
}