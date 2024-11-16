/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react'
import './FilterBar.scss'
import { ModalDatHo } from '../Layout/ModalDatHo'
import axios from 'axios'
import { MenuStatusNhanVienContext } from './MenuStatusNhanVienContext'

const FilterBar = ({ datadatlich, setdatadatlich, fetchdatlich, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ngayDa, setNgayDa] = useState('') // Trạng thái lưu ngày đã chọn
  const { setMenuStatusData } = useContext(MenuStatusNhanVienContext)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Gửi yêu cầu API tìm sân theo ngày
  const fetchSanBongByNgayDa = async () => {
    if (!ngayDa) {
      alert('Vui lòng chọn ngày')
      return
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/getfiltersanbong',
        {
          params: { ngayda: ngayDa }
        }
      )
      setMenuStatusData(response.data)
    } catch (error) {
      console.error('Lỗi khi tìm sân:', error)
    }
  }
const today = new Date().toISOString().split('T')[0]

  return (
    <div className='filter-bar'>
      <button className='info-btn' onClick={handleOpenModal}>
  Điền Thông Tin
</button>

      <div className='select-date'>
        <label>Chọn Ngày:</label>
        <input
          type='date'
          value={ngayDa}
          onChange={e => setNgayDa(e.target.value)}
          min={today}
        />
        <button onClick={fetchSanBongByNgayDa}>Tìm Sân</button>
      </div>

      {isModalOpen && (
        <ModalDatHo
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
          datadatlich={datadatlich}
          fetchdatlich={fetchdatlich}
        />
      )}
    </div>
  )
}

export default FilterBar
