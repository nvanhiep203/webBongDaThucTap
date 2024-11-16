import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HeaderNhanVien.scss'

const HeaderNhanVien = ({ setCurrentPage }) => {
  const navigate = useNavigate() // Dùng hook để điều hướng

  const handleLogout = () => {
    // Xóa thông tin xác thực
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')

    navigate('/')
  }

  return (
    <header className='header'>
      <div className='logo'>HELLO STADIUM</div>
      <nav className='nav'>
        <button className='nut' onClick={() => setCurrentPage('dat-lich')}>
          Đặt Lịch
        </button>
        <button
          className='nut'
          onClick={() => setCurrentPage('thanh-toan-nhanh')}
        >
          Thanh Toán Nhanh
        </button>
        <button
          className='nut'
          onClick={() => setCurrentPage('lich-su')}
        >
          Lịch sử giao dịch
        </button>
        <button className='nut' onClick={() => setCurrentPage('giao-ca')}>
          Giao Ca
        </button>
        <button className='nut' onClick={() => setCurrentPage('check-in')}>
          Check In
        </button>
        <button className='nut' onClick={handleLogout}>
          Đăng xuất
        </button>
        <div className='user-info'>nhan vien 1</div>
      </nav>
    </header>
  )
}

export default HeaderNhanVien
