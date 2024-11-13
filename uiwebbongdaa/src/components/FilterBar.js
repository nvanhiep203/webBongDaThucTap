import React, { useState } from 'react';
import './FilterBar.scss';
import ModalDatSan from '../Layout/CalendarLayout/ModalDatSan';

const FilterBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="filter-bar">
      <button className="filter-btn">Filter</button>
      <button className="select-btn">Chọn Sân</button>
      <button className="info-btn" onClick={handleOpenModal}>Điền Thông Tin</button>

      {/* Hiển thị modal nếu `isModalOpen` là true */}
      {isModalOpen && <ModalDatSan isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default FilterBar;
