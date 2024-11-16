/* eslint-disable react-hooks/exhaustive-deps */
// Modal.js
import React, { useState, useEffect } from 'react'
import './ModalDatLich.scss'

function ModalDatLich ({
  isOpen,
  onClose,
  date,
  userId,
  fetchBookingDays,
  fetchdatlich
}) {
  const [dataca, setdataca] = useState([])
  const [dataloaisan, setdataloaisan] = useState([])
  const [tenLoaiSan, setTenLoaiSan] = useState('sân 7')
  const [selectedShiftId, setSelectedShiftId] = useState(null)
  const [soluongSans, setSoluongSans] = useState({})
  const fetchData = async () => {
    try {
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      console.log(formattedDate)
      const response = await fetch(
        `http://localhost:8080/getCatest/${tenLoaiSan}?ngayda=${formattedDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setdataca(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchloaisan = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getloaisanbong`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setdataloaisan(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (date) {
      fetchData()
    }
  }, [date, tenLoaiSan])

  useEffect(() => {
    fetchloaisan()
  }, [])

  const handleClose = () => {
    setSelectedShiftId(null)
    setSoluongSans({})
    onClose()
  }
  const handledatlichsan = async () => {
    if (!soluongSans[selectedShiftId] || soluongSans[selectedShiftId] <= 0) {
      alert('Vui lòng nhập số lượng sân.')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/datlichsan/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            loaisanbong: tenLoaiSan,
            ngayda: date,
            idca: selectedShiftId,
            soluongsan: soluongSans[selectedShiftId] || 1
          })
        }
      )
      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        handleClose()
        fetchBookingDays()
        fetchdatlich()
        alert('lưu đặt lịch sân thành công')
      }
    } catch (error) {
      console.error('Lỗi khi lưu đặt lịch sân:', error)
    }
  }

  const isToday = date => {
    const today = new Date()
    const currentDate = today.toLocaleDateString()
    const dateToCheck = new Date(date).toLocaleDateString()

    return currentDate === dateToCheck
  }

  const handleShiftClick = id => {
    const selectedShift = dataca.find(shift => shift._id === id)

    if (selectedShift.availableSanCount === 0) {
      alert('Không còn sân trống cho ca này!')
      return
    }

    const currentTime = new Date()
    if (isToday(date)) {
      const timeToMillis = timeStr => {
        const [hours, minutes] = timeStr.split(':').map(Number)
        const date = new Date()
        date.setHours(hours, minutes, 0, 0)
        return date.getTime()
      }

      const currentMillis = currentTime.getTime()
      let endTimeMillis = timeToMillis(selectedShift.endtime)

      if (selectedShift.endtime === '00:00') {
        endTimeMillis = timeToMillis('23:59')
      }

      if (currentMillis > endTimeMillis) {
        alert('Ca này đã kết thúc, không thể đặt!')
        return
      }
    }

    setSelectedShiftId(id)
  }

  const handleSoluongChange = (shiftId, value) => {
    const availableCount =
      dataca.find(shift => shift._id === shiftId)?.availableSanCount || 0

    // Chỉ cho phép nhập số lượng sân <= số sân trống
    const newValue = Math.min(value, availableCount)

    setSoluongSans(prevState => ({
      ...prevState,
      [shiftId]: newValue
    }))
  }

  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Lựa Chọn Ca</h2>
        <p>Ngày: {date.toLocaleDateString()}</p>
        <div className='chonloaisan'>
          <label htmlFor='loaisan-select'>Chọn loại sân:</label>
          <select
            id='loaisan-select'
            value={tenLoaiSan}
            onChange={e => setTenLoaiSan(e.target.value)}
          >
            <option value=''>--Chọn loại sân--</option>
            {dataloaisan.map(loaisan => (
              <option key={loaisan.id} value={loaisan.tenloaisan}>
                {loaisan.tenloaisan}
              </option>
            ))}
          </select>
        </div>

        <div className='shift-container'>
          {dataca.map(shift => (
            <div
              key={shift._id}
              className={`shift ${
                selectedShiftId === shift._id ? 'selected' : ''
              }`}
              onClick={() => handleShiftClick(shift._id)}
            >
              <h3>
                {shift.tenca}: {shift.begintime} - {shift.endtime}
              </h3>
              <p>Giá ca: {shift.giaca.toLocaleString()} đ</p>
              <p>Sân trống: {shift.availableSanCount}</p>
              <label>
                SL Sân:
                <input
                  type='number'
                  placeholder='0'
                  min='0'
                  value={soluongSans[shift._id]}
                  onChange={e => handleSoluongChange(shift._id, e.target.value)}
                  disabled={shift.availableSanCount === 0}
                  max={shift.availableSanCount}
                />
              </label>
            </div>
          ))}
        </div>
        <button onClick={handledatlichsan}>Lưu</button>
        <button onClick={handleClose}>Hủy</button>
      </div>
    </div>
  )
}

export default ModalDatLich
