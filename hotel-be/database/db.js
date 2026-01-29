// Dùng mysql2 bản promise
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// Tạo kết nối dạng pool (hỗ trợ async/await)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("kết nối MySQL thành công!");
        connection.release();
    } catch (err) {
        console.error("Lỗi kết nối MySQL:", err);
    }
})();

module.exports = pool;