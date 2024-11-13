import React from 'react';
import './HeaderNhanVien.scss';

const HeaderNhanVien = ({ setCurrentPage }) => {
  return (
    <header className="header">
      <div className="logo">DONGDE STADIUM</div>
      <nav className="nav">
        <button className='nut' onClick={() => setCurrentPage('dat-lich')}>Đặt Lịch</button>
        <button className='nut' onClick={() => setCurrentPage('thanh-toan-nhanh')}>Thanh Toán Nhanh</button>
        <button className='nut' onClick={() => setCurrentPage('giao-ca')}>Giao Ca</button>
        <button className='nut' onClick={() => setCurrentPage('check-in')}>Check In</button>
        <div className="user-info">nhan vien 1</div>
      </nav>
    </header>
  );
};

export default HeaderNhanVien;
