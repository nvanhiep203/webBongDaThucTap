import React, { useEffect, useState, useContext } from 'react'
import './MenuStatusNhanVien.scss'
import { MenuStatusNhanVienContext } from './MenuStatusNhanVienContext'

const MenuStatusNhanVien = () => {
  const [data, setdata] = useState({})
  const { setMenuStatusData } = useContext(MenuStatusNhanVienContext)

  const fetchSoluongca = async () => {
    try {
      const response = await fetch(`http://localhost:8080/soluongsan`)
      if (response.ok) {
        const data = await response.json()
        setdata(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchSoluongca()
  }, [])

  const handleSanTrong = async () => {
    try {
      const response = await fetch(`http://localhost:8080/santrong`)
      if (response.ok) {
        const data = await response.json()
        setMenuStatusData(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSanQuaGio = async () => {
    try {
      const response = await fetch(`http://localhost:8080/sanquagio`)
      if (response.ok) {
        const data = await response.json()
        setMenuStatusData(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchsanbong = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getallsanbong`)
      if (response.ok) {
        const data = await response.json()
        setMenuStatusData(data)
      } else {
        console.log('đã xảy ra lỗi')
      }
    } catch (error) {
      console.error('Error fetching shifts:', error)
    }
  }

  const fetchchonhansan = async () => {
  try {
    const response = await fetch(`http://localhost:8080/chonhansan`)
    if (response.ok) {
      const data = await response.json()
      setMenuStatusData(data)
    } else {
      console.log('đã xảy ra lỗi')
    }
  } catch (error) {
    console.error('Error fetching shifts:', error)
  }
}


  return (
    <div className='menu-status'>
      <div className='status-item' onClick={fetchsanbong}>
        <span className='status-icon all-icon'>{data.soluongCaTong}</span>
        <p>Tất cả</p>
      </div>
      <div className='status-item' onClick={handleSanTrong}>
        <span className='status-icon available-icon'>
          {data.soluongcaTrongTong}
        </span>
        <p>Đang trống</p>
      </div>
      <div className='status-item'>
        <span className='status-icon waiting-icon' onClick={fetchchonhansan}>
          {data.soluongCaChoNhanSan}
        </span>
        <p>Chờ nhận sân</p>
      </div>
      <div className='status-item'>
        <span className='status-icon payment-icon'>
          {data.soluongCaHoatDong}
        </span>
        <p>Chờ thanh toán</p>
      </div>
      <div className='status-item'>
        <span className='status-icon active-icon'>
          {data.soluongCaHoatDong}
        </span>
        <p>Đang hoạt động</p>
      </div>
      <div className='status-item' onClick={handleSanQuaGio}>
        <span className='status-icon quagio-icon'>{data.soluongCaQuaGio}</span>
        <p>Quá giờ</p>
      </div>
    </div>
  )
}

export default MenuStatusNhanVien
