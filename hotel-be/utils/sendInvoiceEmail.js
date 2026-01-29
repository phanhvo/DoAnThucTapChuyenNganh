require("dotenv").config();
const nodemailer = require("nodemailer");
console.log("ENV EMAIL_USER =", process.env.EMAIL_USER);
console.log("ENV EMAIL_PASS =", process.env.EMAIL_PASS ? "OK" : "MISSING");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendInvoiceEmail = async (to, invoice) => {
    const html = `
    <h2>HÓA ĐƠN THANH TOÁN KHÁCH SẠN</h2>
    <p><b>Mã hóa đơn:</b> ${invoice.MaHD}</p>
    <p><b>Mã đặt phòng:</b> ${invoice.MaDP}</p>
    <p><b>Mã phòng:</b> ${invoice.MaPhong}</p>
    <p><b>Ngày nhận:</b> ${invoice.NgayNhanPhong}</p>
    <p><b>Ngày trả:</b> ${invoice.NgayTraPhong}</p>
    <p><b>Số đêm:</b> ${invoice.SoDem}</p>
    <p><b>Tổng tiền:</b> ${invoice.TongTien.toLocaleString()} VNĐ</p>
    <hr />
    <p>Cảm ơn quý khách đã sử dụng dịch vụ ❤️</p>
  `;

    try {
        await transporter.sendMail({
            from: `"HotelPhuongAnh" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Hóa đơn thanh toán khách sạn",
            html,
        });
        console.log("Đã gửi email tới:", to);
    } catch (err) {
        console.error("Lỗi gửi email:", err);
        throw err;
    }
};
