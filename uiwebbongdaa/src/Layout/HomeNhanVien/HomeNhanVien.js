import React, { useState } from 'react'
import HeaderNhanVien from '../../components/HeaderNhanVien'
import DatLich from './DatLich/DatLich'
import GiaoCa from './GiaoCa/GiaoCa'

import ThanhToanNhanh from './ThanhToanNhanh/ThanhToanNhanh'
import CheckInScreen from './CheckIn/CheckInScreen'
import LichSuGiaoDich from '../../components/LichSuGiaoDich'
import './HomeNhanVien.scss'
import { useLocation } from 'react-router-dom'
import NhanCa from './NhanCa'

const HomeNhanVien = () => {
  const [currentPage, setCurrentPage] = useState('dat-lich')
  const location = useLocation()
  const nhanca = location.state.nhanca
  const khoitaoca = location.state?.khoitaoca || ''
  const userId = location.state?.userId || ''
  const [nhancaust, setnhanca] = useState(nhanca)
  const [khoitaocaust, setkhoitaoca] = useState(khoitaoca)
  console.log(nhanca)

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dat-lich':
        return <DatLich />
      case 'thanh-toan-nhanh':
        return <ThanhToanNhanh />
      case 'giao-ca':
        return <GiaoCa />
      case 'check-in':
        return <CheckInScreen />
      case 'lich-su':
        return <LichSuGiaoDich />

      default:
        return <DatLich />
    }
  }

  return (
    <div className='booking-screen'>
      {(nhancaust === false || khoitaocaust === true) && (
        <NhanCa
          userId={userId}
          khoitaoca={khoitaocaust}
          setkhotaocaus={setkhoitaoca}
          setnhancaus={setnhanca}
          nhanca={nhancaust}
        />
      )}
      <HeaderNhanVien setCurrentPage={setCurrentPage} />
      <main>{renderPageContent()}</main>
    </div>
  )
}

export default HomeNhanVien
