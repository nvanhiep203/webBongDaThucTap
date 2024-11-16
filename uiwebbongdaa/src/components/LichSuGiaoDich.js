import React, { useEffect, useState } from 'react'
import axios from 'axios'

function LichSuGiaoDich () {
  const [shifts, setShifts] = useState([])

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/lichsugiaodich')
      setShifts(response.data)
    } catch (error) {
      console.error('Error fetching shifts:', error)
    }
  }

  return (
    <div>
      <h1>Lịch sử giao dịch</h1>
      <table>
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Họ và tên</th>
            <th>Số điện thoại</th>
            <th>Phương thức</th>
            <th>Ngày giờ</th>
            <th>Nội dung</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map(shift => (
            <tr key={shift._id}>
              <td>{shift.maGD}</td>
              <td>{shift.hovaten}</td>
              <td>{shift.sodienthoai}</td>
              <td>{shift.method}</td>
              <td>{shift.ngaygio}</td>
              <td>{shift.noiDung}</td>
              <td>{shift.tongtien.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LichSuGiaoDich
