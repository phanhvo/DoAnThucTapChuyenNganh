-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th1 13, 2026 lúc 03:25 PM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quanlykhachsan`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiet_dp`
--

DROP TABLE IF EXISTS `chitiet_dp`;
CREATE TABLE IF NOT EXISTS `chitiet_dp` (
  `MaDP` char(10) NOT NULL,
  `MaQTV` char(10) DEFAULT NULL,
  `MaKH` char(10) DEFAULT NULL,
  `MaPhong` char(10) DEFAULT NULL,
  `MaDV` char(10) DEFAULT NULL,
  `NgayNhanPhong` date DEFAULT NULL,
  `NgayTraPhong` date DEFAULT NULL,
  `SoLuongNguoi` int DEFAULT NULL,
  `SoLuongPhong` int DEFAULT NULL,
  PRIMARY KEY (`MaDP`),
  KEY `MaQTV` (`MaQTV`),
  KEY `MaKH` (`MaKH`),
  KEY `MaPhong` (`MaPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitiet_dp`
--

INSERT INTO `chitiet_dp` (`MaDP`, `MaQTV`, `MaKH`, `MaPhong`, `MaDV`, `NgayNhanPhong`, `NgayTraPhong`, `SoLuongNguoi`, `SoLuongPhong`) VALUES
('DP64221208', NULL, 'KH300174', 'P01', NULL, '2025-12-23', '2025-12-24', 1, 1),
('DP64222358', NULL, 'KH300174', 'P02', NULL, '2025-12-25', '2025-12-26', 1, 1),
('DP64255829', NULL, 'KH300174', 'P02', NULL, '2025-12-27', '2025-12-28', 1, 1),
('DP64275879', NULL, 'KH300174', 'P01', NULL, '2025-12-27', '2025-12-28', 1, 1),
('DP64279518', NULL, 'KH300174', 'P02', NULL, '2025-12-30', '2026-01-01', 2, 1),
('DP64281265', NULL, 'KH223000', 'P02', NULL, '2026-01-02', '2026-01-03', 1, 1),
('DP64283808', NULL, 'KH300174', 'P01', NULL, '2026-01-02', '2026-01-03', 1, 1),
('DP64284532', NULL, 'KH223000', 'P02', NULL, '2026-01-04', '2026-01-05', 1, 1),
('DP64287015', NULL, 'KH908092', 'P02', NULL, '2026-01-06', '2026-01-08', 2, 1),
('DP64288132', NULL, 'KH300174', 'P01', NULL, '2026-01-04', '2026-01-05', 1, 1),
('DP64288703', NULL, 'KH300174', 'P01', NULL, '2026-01-07', '2026-01-08', 1, 1),
('DP71099398', NULL, 'KH300174', 'P02', NULL, '2026-01-01', '2026-01-02', 1, 1),
('DP71101729', NULL, 'KH300174', 'P02', NULL, '2026-01-03', '2026-01-04', 1, 1),
('DP73470294', NULL, 'KH300174', 'P03', NULL, '2026-01-03', '2026-01-04', 1, 1),
('DP79393261', 'QTV001', NULL, 'P04', NULL, '2026-01-10', '2026-01-11', 1, 1),
('DP79393658', 'QTV002', NULL, 'P04', NULL, '2026-01-12', '2026-01-13', 1, 1),
('DP79394070', NULL, 'KH300174', 'P04', NULL, '2026-01-14', '2026-01-15', 1, 1),
('DP80230587', NULL, 'KH01', 'P04', NULL, '2026-02-06', '2026-02-07', 2, 1),
('DP83119467', NULL, 'KH300174', 'P03', NULL, '2026-01-19', '2026-01-20', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chucvu`
--

DROP TABLE IF EXISTS `chucvu`;
CREATE TABLE IF NOT EXISTS `chucvu` (
  `MaCV` char(10) NOT NULL,
  `TenCV` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MaCV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chucvu`
--

INSERT INTO `chucvu` (`MaCV`, `TenCV`) VALUES
('CV01', 'Admin'),
('CV02', 'NhanVien');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhgia`
--

DROP TABLE IF EXISTS `danhgia`;
CREATE TABLE IF NOT EXISTS `danhgia` (
  `MaKH` char(10) NOT NULL,
  `NgayDG` date NOT NULL,
  PRIMARY KEY (`MaKH`,`NgayDG`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dichvu`
--

DROP TABLE IF EXISTS `dichvu`;
CREATE TABLE IF NOT EXISTS `dichvu` (
  `MaDV` char(10) NOT NULL,
  `TenDV` varchar(50) DEFAULT NULL,
  `BangGia` decimal(18,2) DEFAULT NULL,
  `MaDP` char(10) DEFAULT NULL,
  PRIMARY KEY (`MaDV`),
  KEY `MaDP` (`MaDP`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
CREATE TABLE IF NOT EXISTS `hoadon` (
  `MaHD` char(10) NOT NULL,
  `MaDP` char(10) DEFAULT NULL,
  `MaKH` char(10) DEFAULT NULL,
  `MaQTV` char(10) DEFAULT NULL,
  `SoDem` int DEFAULT NULL,
  `SoLuongPhong` int DEFAULT NULL,
  `SoLuongDV` int DEFAULT NULL,
  `TongTien` decimal(18,2) DEFAULT NULL,
  `TrangThai` enum('pending','paid','expired') DEFAULT NULL,
  `PhuongThucTT` enum('tienmat','qr','vidientu') DEFAULT NULL,
  `PaymentRef` varchar(255) DEFAULT NULL,
  `NgayXuat` datetime DEFAULT CURRENT_TIMESTAMP,
  `NgayThanhToan` datetime DEFAULT NULL,
  PRIMARY KEY (`MaHD`),
  KEY `MaDP` (`MaDP`),
  KEY `MaKH` (`MaKH`),
  KEY `MaQTV` (`MaQTV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`MaHD`, `MaDP`, `MaKH`, `MaQTV`, `SoDem`, `SoLuongPhong`, `SoLuongDV`, `TongTien`, `TrangThai`, `PhuongThucTT`, `PaymentRef`, `NgayXuat`, `NgayThanhToan`) VALUES
('HD64221208', 'DP64221208', 'KH300174', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2025-12-22 23:48:40', '2025-12-22 23:49:49'),
('HD64222358', 'DP64222358', 'KH300174', 'QTV001', 1, 1, 0, 500000.00, 'paid', 'tienmat', NULL, '2025-12-22 23:50:35', '2025-12-22 23:51:09'),
('HD64255830', 'DP64255829', 'KH300174', 'QTV001', 1, 1, 0, 500000.00, 'paid', 'tienmat', NULL, '2025-12-23 00:46:23', '2025-12-23 01:13:19'),
('HD64275879', 'DP64275879', 'KH300174', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:19:48', '2025-12-23 01:23:27'),
('HD64279518', 'DP64279518', 'KH300174', 'QTV001', 2, 1, 0, 1000000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:25:51', '2025-12-23 01:26:09'),
('HD64281265', 'DP64281265', 'KH223000', 'QTV001', 1, 1, 0, 500000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:28:46', '2025-12-23 01:29:07'),
('HD64283808', 'DP64283808', 'KH300174', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:33:00', '2025-12-23 01:33:16'),
('HD64284532', 'DP64284532', 'KH223000', 'QTV002', 1, 1, 0, 500000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:34:13', '2025-12-23 01:34:30'),
('HD64287015', 'DP64287015', 'KH908092', 'QTV001', 2, 1, 0, 1000000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:38:21', '2025-12-23 01:38:38'),
('HD64288132', 'DP64288132', 'KH300174', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2025-12-23 01:40:13', '2025-12-23 01:40:35'),
('HD64288703', 'DP64288703', 'KH300174', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'vidientu', 'WALLET_REF_1766428876198', '2025-12-23 01:41:10', '2025-12-23 01:41:37'),
('HD71099398', 'DP71099398', 'KH300174', 'QTV001', 1, 1, 0, 500000.00, 'paid', 'tienmat', NULL, '2025-12-30 22:52:19', '2025-12-30 22:52:38'),
('HD71101729', 'DP71101729', 'KH300174', 'QTV001', 1, 1, 0, 500000.00, 'paid', 'tienmat', NULL, '2025-12-30 22:56:12', '2025-12-30 22:56:33'),
('HD73470294', 'DP73470294', 'KH300174', 'QTV001', 1, 1, 0, 800000.00, 'paid', 'tienmat', NULL, '2026-01-02 16:43:49', '2026-01-02 16:44:10'),
('HD79393261', 'DP79393261', NULL, 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2026-01-09 13:15:26', '2026-01-09 13:15:36'),
('HD79393658', 'DP79393658', NULL, 'QTV002', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2026-01-09 13:16:05', '2026-01-09 13:16:14'),
('HD79394070', 'DP79394070', 'KH300174', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2026-01-09 13:16:47', '2026-01-09 13:17:02'),
('HD80230587', 'DP80230587', 'KH01', 'QTV001', 1, 1, 0, 300000.00, 'paid', 'tienmat', NULL, '2026-01-10 12:30:58', '2026-01-10 12:39:01'),
('HD83119467', 'DP83119467', 'KH300174', 'QTV001', 1, 1, 0, 800000.00, 'paid', 'tienmat', NULL, '2026-01-13 20:45:46', '2026-01-13 20:47:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

DROP TABLE IF EXISTS `khachhang`;
CREATE TABLE IF NOT EXISTS `khachhang` (
  `MaKH` char(10) NOT NULL,
  `HoTenKH` varchar(50) DEFAULT NULL,
  `GioiTinh` char(10) DEFAULT NULL,
  `NgSinh` date DEFAULT NULL,
  `SDT` char(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `CCCD` char(12) DEFAULT NULL,
  `DiaChi` varchar(200) DEFAULT NULL,
  `NgayDK` date DEFAULT NULL,
  `LoaiKhach` varchar(30) DEFAULT NULL,
  `MatKhauKH` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`MaKH`, `HoTenKH`, `GioiTinh`, `NgSinh`, `SDT`, `Email`, `CCCD`, `DiaChi`, `NgayDK`, `LoaiKhach`, `MatKhauKH`) VALUES
('KH01', 'Lam Du Cuong', 'Nam', '2000-02-02', '0909123456', 'lamducuong@gmail.com', '123456789012', 'Ha Noi', '2025-12-22', 'Thuong', '123456'),
('KH223000', 'Võ Phương Anh', NULL, NULL, NULL, 'phuonganhdth123@gmail.com', NULL, NULL, NULL, NULL, '123'),
('KH300174', 'TESTER', NULL, NULL, NULL, 'ongdeo4369@gmail.com', NULL, NULL, NULL, NULL, '123'),
('KH556574', 'Phuc02', NULL, NULL, '025588', 'babyboo02@gmail.com', NULL, '180 cao lo', NULL, NULL, '123'),
('KH908092', 'long', NULL, NULL, NULL, 'longgphi207@gmail.com', NULL, NULL, NULL, NULL, '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichlamviec`
--

DROP TABLE IF EXISTS `lichlamviec`;
CREATE TABLE IF NOT EXISTS `lichlamviec` (
  `MaCa` char(10) NOT NULL,
  `MaQTV` char(10) DEFAULT NULL,
  `NgayLam` date DEFAULT NULL,
  PRIMARY KEY (`MaCa`),
  KEY `MaQTV` (`MaQTV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loaiphong`
--

DROP TABLE IF EXISTS `loaiphong`;
CREATE TABLE IF NOT EXISTS `loaiphong` (
  `MaLoai` char(10) NOT NULL,
  `TenLoai` varchar(50) DEFAULT NULL,
  `MoTa` varchar(200) DEFAULT NULL,
  `GiaPhong` decimal(18,2) DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MaLoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `loaiphong`
--

INSERT INTO `loaiphong` (`MaLoai`, `TenLoai`, `MoTa`, `GiaPhong`, `HinhAnh`) VALUES
('LP01', 'Phòng Đơn', 'Phong 1 giường đơn máy chiếu', 300000.00, 'phongdon.jpg'),
('LP02', 'Phòng Đôi', 'Phong 2 giường đôi', 500000.00, 'phongdoi.jpg'),
('LP03', 'Phòng Đơn(ban công)', 'Phòng đơn có ban công ', 900000.00, 'phongdon(bancong).jpg'),
('LP05', 'Phòng Đôi(ban công)', 'Phòng đôi có ban công', 1200000.00, 'phongdoi.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

DROP TABLE IF EXISTS `phong`;
CREATE TABLE IF NOT EXISTS `phong` (
  `MaPhong` char(10) NOT NULL,
  `TinhTrangPhong` varchar(30) DEFAULT NULL,
  `SoLuongPhong` int DEFAULT NULL,
  `MaLoai` char(10) DEFAULT NULL,
  PRIMARY KEY (`MaPhong`),
  KEY `MaLoai` (`MaLoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `phong`
--

INSERT INTO `phong` (`MaPhong`, `TinhTrangPhong`, `SoLuongPhong`, `MaLoai`) VALUES
('P01', 'Đang sử dụng', 5, 'LP01'),
('P02', 'Trống', 3, 'LP02'),
('P03', 'Trống', 1, 'LP03'),
('P04', 'Trống', 1, 'LP01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quantrivien`
--

DROP TABLE IF EXISTS `quantrivien`;
CREATE TABLE IF NOT EXISTS `quantrivien` (
  `MaQTV` char(10) NOT NULL,
  `HoTen` varchar(50) DEFAULT NULL,
  `GioiTinh` char(10) DEFAULT NULL,
  `NgSinh` date DEFAULT NULL,
  `SDT` char(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DiaChi` varchar(200) DEFAULT NULL,
  `MaCV` char(10) DEFAULT NULL,
  `MatKhauQTV` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaQTV`),
  KEY `MaCV` (`MaCV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `quantrivien`
--

INSERT INTO `quantrivien` (`MaQTV`, `HoTen`, `GioiTinh`, `NgSinh`, `SDT`, `Email`, `DiaChi`, `MaCV`, `MatKhauQTV`) VALUES
('QTV001', 'Nguyen Hong Quoc Truong', 'Nam', '1990-01-01', '0909000001', 'admin@gmail.com', 'TP.HCM', 'CV01', '123456'),
('QTV002', 'Vo Phuong Anh', 'Nu', '1998-05-10', '0909000002', 'nhanvien@gmail.com', 'TP.HCM', 'CV02', '123456');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitiet_dp`
--
ALTER TABLE `chitiet_dp`
  ADD CONSTRAINT `chitiet_dp_ibfk_1` FOREIGN KEY (`MaQTV`) REFERENCES `quantrivien` (`MaQTV`),
  ADD CONSTRAINT `chitiet_dp_ibfk_2` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`),
  ADD CONSTRAINT `chitiet_dp_ibfk_3` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`);

--
-- Các ràng buộc cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `danhgia_ibfk_1` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`);

--
-- Các ràng buộc cho bảng `dichvu`
--
ALTER TABLE `dichvu`
  ADD CONSTRAINT `dichvu_ibfk_1` FOREIGN KEY (`MaDP`) REFERENCES `chitiet_dp` (`MaDP`);

--
-- Các ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `hoadon_ibfk_1` FOREIGN KEY (`MaDP`) REFERENCES `chitiet_dp` (`MaDP`),
  ADD CONSTRAINT `hoadon_ibfk_2` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`),
  ADD CONSTRAINT `hoadon_ibfk_3` FOREIGN KEY (`MaQTV`) REFERENCES `quantrivien` (`MaQTV`);

--
-- Các ràng buộc cho bảng `lichlamviec`
--
ALTER TABLE `lichlamviec`
  ADD CONSTRAINT `lichlamviec_ibfk_1` FOREIGN KEY (`MaQTV`) REFERENCES `quantrivien` (`MaQTV`);

--
-- Các ràng buộc cho bảng `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`MaLoai`) REFERENCES `loaiphong` (`MaLoai`);

--
-- Các ràng buộc cho bảng `quantrivien`
--
ALTER TABLE `quantrivien`
  ADD CONSTRAINT `quantrivien_ibfk_1` FOREIGN KEY (`MaCV`) REFERENCES `chucvu` (`MaCV`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
