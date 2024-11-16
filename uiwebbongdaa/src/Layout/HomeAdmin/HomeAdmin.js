import React, { useState } from 'react'

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import UserTable from '../../components/UserTable';
import LuatSan from '../../components/LuatSan';
import GiaoCaTable from '../../components/GiaoCaTable';
import SanbongTable from '../../components/SanbongTable';
import DoThueTable from '../../components/DoThueTable';
import DoUongTable from '../../components/DoUongTable';
import CaBongTable from '../../components/CaBongTable';
import ThamSoTable from '../../components/ThamSoTable';
import LichSuGiaoDich from '../../components/LichSuGiaoDich';

import './HomeAdmin.scss'
function HomeAdmin () {
  const [selectedDataKey, setSelectedDataKey] = useState('staffManagement')

  const handleItemSelect = dataKey => {
    setSelectedDataKey(dataKey)
  }
  const renderContent = () => {
    switch (selectedDataKey) {
      case 'staffManagement':
        return <UserTable />
      case 'fieldManagement':
        return <SanbongTable />
      case 'rulesManagement':
        return <LuatSan/>;
      case 'shiftManagement':
        return <GiaoCaTable />
      case 'parameterManagement':
        return <ThamSoTable />
      case 'equipmentManagement':
        return <DoThueTable />
      case 'beverageManagement':
        return <DoUongTable />
      case 'quanlyca':
        return <CaBongTable />
      case 'lichsu':
        return <LichSuGiaoDich />
      default:
        return <UserTable />
    }
  }
  return (
    <div className='HomeAdmin-container'>
      <Sidebar onItemSelect={handleItemSelect} />
      <div className='a-content'>
        <Header />
        {/* <UserForm /> */}
        {renderContent()}
      </div>
    </div>
  )
}

export default HomeAdmin
