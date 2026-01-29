import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getMonthlyRevenue } from "../api";
import {
    Chart,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";
Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BieuDoDoanhThu() {
    const [data, setData] = useState([]);
    //này sẽ lấy dữ liệu từ mảng data bên api
    useEffect(() => {
        getMonthlyRevenue()
            .then(rows => setData(rows || []))
            .catch(err => {
                console.error("Lỗi lấy doanh thu:", err);
                setData([]);
            });
    }, []);

    const labels = data.map(d => `T${d.Thang}/${d.Nam}`).reverse(); // reverse để Tăng từ nhỏ->lớn nếu server trả DESC
    const values = data.map(d => Number(d.DoanhThu) || 0).reverse();

    const chartData = {
        labels,
        datasets: [
            {
                label: "Doanh thu (VNĐ)",
                data: values,
                borderColor: "#4e73df",
                backgroundColor: "rgba(78,115,223,0.2)",
                borderWidth: 3,
                tension: 0.3,
                pointRadius: 4
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => context.raw.toLocaleString("vi-VN") + " VNĐ"
                }
            },
            legend: { display: true }
        },
        scales: {
            y: {
                ticks: {
                    callback: (v) => v.toLocaleString("vi-VN")
                }
            }
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Biểu đồ doanh thu theo tháng</h2>
            <Line data={chartData} options={options} />
        </div>
    );
}
