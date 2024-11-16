import React, { useState } from 'react'
import './ShiftCard.scss'
import { useLocation } from 'react-router-dom'

const ShiftCard = ({ shift, fetchdatlich }) => {
  const currentDate = new Date().toLocaleDateString('vi-VN')
  const location = useLocation()

  const userId = location.state?.userId || ''

  const getButtonClass = trangthai => {
    const status = trangthai
    return status === 'Quá giờ' ? 'status-btn overdue' : 'status-btn'
  }

  const [checkedItems, setCheckedItems] = useState({})

  const handleCheckboxChange = (caId, trangthai, loaisan, ngayda) => {
    const status = trangthai

    if (status === 'Quá giờ') {
      alert('Ca đã quá giờ. Không thể chọn!')
      return
    }
    if (status === 'Chờ nhận sân') {
      alert('Ca đã được đặt. Không thể chọn')
      return
    }

    setCheckedItems(prev => {
      const newCheckedState = {
        ...prev,
        [caId]: !prev[caId]
      }

      if (newCheckedState[caId]) {
        handledatlichsan(loaisan, ngayda, caId)
      }

      return newCheckedState
    })
  }

  const convertDate = dateString => {
    const [day, month, year] = dateString.split('-') // Tách chuỗi thành ngày, tháng, năm
    return new Date(`${year}-${month}-${day}`) // Tạo đối tượng Date
  }

  const handledatlichsan = async (tenLoaiSan, date, selectedShiftId) => {
    try {
      const formattedDate = convertDate(date)

      const response = await fetch(
        `http://localhost:8080/datlichsan/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            loaisanbong: tenLoaiSan,
            ngayda: formattedDate,
            idca: selectedShiftId,
            soluongsan: 1
          })
        }
      )
      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert('lưu đặt lịch sân thành công')
        fetchdatlich()
      }
    } catch (error) {
      console.error('Lỗi khi lưu đặt lịch sân:', error)
    }
  }

  return (
    <div className='divshiftitem'>
      {shift.ca.map((ca, index) => (
        <div className='shift-card' key={ca._id}>
          <div className='shift-header'>
            <input
              type='checkbox'
              onChange={() =>
                handleCheckboxChange(ca._id, ca.trangthai, ca.loaisan, ca.date)
              }
              checked={checkedItems[ca._id] || false}
            />
            <div className='divheadershiftcon'>
              <h3>{ca.tenca} </h3>
              <p>Loại sân: {ca.loaisan}</p>
            </div>
          </div>
          <div className='shift-details'>
            <p>📅 {ca.date}</p>
            <p>🕒 {`${ca.begintime} - ${ca.endtime}`}</p>
            <p>💵 {ca.giaca.toLocaleString()} đ</p>
            <button className={getButtonClass(ca.trangthai)}>
              {ca.trangthai}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ShiftCard
