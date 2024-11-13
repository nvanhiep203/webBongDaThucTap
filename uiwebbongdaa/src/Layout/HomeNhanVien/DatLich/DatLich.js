import React from 'react';
import FilterBar from '../../../components/FilterBar';
import ShiftCard from '../../../components/ShiftCard';
import MenuStatusNhanVien from '../../../components/MenuStatusNhanVien';

import './DatLich.scss';

const shifts = [
  { ca: 1, type: 'Sân 5', date: '2024-01-13', time: '06:00 - 08:30', price: '450.000 đ' },
  { ca: 2, type: 'Sân 5', date: '2024-01-13', time: '09:00 - 11:30', price: '450.000 đ' },
  { ca: 3, type: 'Sân 5', date: '2024-01-13', time: '12:00 - 14:30', price: '450.000 đ' },
  // Thêm các ca khác
];

const DatLich = () => {
  return (
    <div className="booking-screen">
      <MenuStatusNhanVien />
      <FilterBar />

      <div className="shift-list">
        {shifts.map((shift, index) => (
          <ShiftCard key={index} shift={shift} />
        ))}
      </div>
    </div>
  );
};

export default DatLich;
