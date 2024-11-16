import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import axios from 'axios'

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function ThongKeLayout () {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [chartData, setChartData] = useState(null)

  const fetchData = async () => {
    try {
      if (!startDate || !endDate) {
        alert('Vui lòng chọn cả hai ngày bắt đầu và kết thúc!')
        return
      }

      const response = await axios.get('http://localhost:8080/doanhthu', {
        params: { startDate, endDate }
      })

      const data = response.data

      // Xử lý dữ liệu cho biểu đồ
      const labels = data.map(item => item.ngay) // Các ngày
      const doanhThu = data.map(item => item.tongDoanhThu) // Doanh thu từng ngày

      setChartData({
        labels,
        datasets: [
          {
            label: 'Doanh Thu Theo Ngày',
            data: doanhThu,
            borderColor: 'rgba(75, 192, 192, 1)', // Màu đường
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền dưới đường
            fill: true
          }
        ]
      })
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu doanh thu:', error)
    }
  }

  // Lấy ngày hiện tại
  const currentDate = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h2>Biểu đồ Doanh Thu Theo Ngày</h2>
      {/* Phần nhập ngày */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Từ ngày:
          <input
            type='date'
            value={startDate}
            max={currentDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ marginRight: '10px', marginLeft: '10px' }}
          />
        </label>
        <label>
          Đến ngày:
          <input
            type='date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            max={currentDate} // Giới hạn chọn ngày đến ngày hiện tại
            style={{ marginRight: '10px', marginLeft: '10px' }}
          />
        </label>
        <button onClick={fetchData}>Tìm kiếm</button>
      </div>

      {/* Hiển thị biểu đồ */}
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              x: {
                type: 'category', // Trục x là các ngày
                title: {
                  display: true,
                  text: 'Ngày'
                }
              },
              y: {
                type: 'linear', // Trục y là doanh thu
                title: {
                  display: true,
                  text: 'Doanh Thu (VNĐ)'
                }
              }
            }
          }}
        />
      ) : (
        <p>Hãy chọn ngày và nhấn tìm kiếm để xem biểu đồ!</p>
      )}
    </div>
  )
}

export default ThongKeLayout
