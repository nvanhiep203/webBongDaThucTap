import React from 'react';
import './ShiftCard.scss';

const ShiftCard = ({ shift }) => {
  return (
    <div className="shift-card">
      <div className="shift-header">
        <input type="checkbox" />
        <h3>Ca {shift.ca}</h3>
        <p>Loại sân: {shift.type}</p>
      </div>
      <div className="shift-details">
        <p>📅 {shift.date}</p>
        <p>🕒 {shift.time}</p>
        <p>💵 {shift.price}</p>
        <button className="status-btn">Đang trống</button>
      </div>
    </div>
  );
};

export default ShiftCard;
