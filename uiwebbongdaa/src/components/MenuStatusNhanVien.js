import React from 'react';
import './MenuStatusNhanVien.scss';

const MenuStatusNhanVien = () => {
  return (
    <div className="menu-status">
      <div className="status-item">
        <span className="status-icon all-icon">42</span>
        <p>Tất cả</p>
      </div>
      <div className="status-item">
        <span className="status-icon available-icon">38</span>
        <p>Đang trống</p>
      </div>
      <div className="status-item">
        <span className="status-icon waiting-icon">2</span>
        <p>Chờ nhận sân</p>
      </div>
      <div className="status-item">
        <span className="status-icon payment-icon">0</span>
        <p>Chờ thanh toán</p>
      </div>
      <div className="status-item">
        <span className="status-icon active-icon">2</span>
        <p>Đang hoạt động</p>
      </div>
      <div className="status-item">
        <span className="status-icon quagio-icon">4</span>
        <p>Quá giờ</p>
      </div>
    </div>
  );
};

export default MenuStatusNhanVien;
