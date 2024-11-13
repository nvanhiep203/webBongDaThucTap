import React, { useState } from 'react';
import HeaderNhanVien from '../../components/HeaderNhanVien';
import DatLich from './DatLich/DatLich';
import ThanhToanNhanh from './ThanhToanNhanh/ThanhToanNhanh';
import CheckInScreen from './CheckIn/CheckInScreen';
import './HomeNhanVien.scss';

const HomeNhanVien = () => {
    const [currentPage, setCurrentPage] = useState('dat-lich');

    const renderPageContent = () => {
        switch (currentPage) {
            case 'dat-lich':
                return <DatLich />;
            case 'thanh-toan-nhanh':
                return <ThanhToanNhanh />;
            case 'check-in':
                return <CheckInScreen />;

            default:
                return <DatLich />;
        }
    };

    return (
        <div className="booking-screen">
            <HeaderNhanVien setCurrentPage={setCurrentPage} />
            <main>
                {renderPageContent()}
            </main>
        </div>
    );
};

export default HomeNhanVien;
