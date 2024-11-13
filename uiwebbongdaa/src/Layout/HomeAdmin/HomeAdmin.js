import React, { useState } from 'react';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import UserForm from '../../components/UserForm';
import UserTable from '../../components/UserTable';
import SanbongTable from '../../components/SanbongTable';
import DoThueTable from '../../components/DoThueTable';
import DoUongTable from '../../components/DoUongTable';
import CaBongTable from '../../components/CaBongTable';
import ThamSoTable from '../../components/ThamSoTable';

import './HomeAdmin.scss';
function HomeAdmin() {
  const [selectedDataKey, setSelectedDataKey] = useState('staffManagement');

  const handleItemSelect = (dataKey) => {
    setSelectedDataKey(dataKey);
  };
  const renderContent = () => {
    switch (selectedDataKey) {
      case 'staffManagement':
        return <UserTable />;
      case 'fieldManagement':
        return <SanbongTable />;
      case 'rulesManagement':
        return <div>Rules Management Content</div>;
      case 'shiftManagement':
        return <div>Shift Management Content</div>;
      case 'parameterManagement':
        return <ThamSoTable/>;
      case 'equipmentManagement':
        return <DoThueTable />;
      case 'beverageManagement':
        return <DoUongTable />;
      case 'quanlyca':
        return <CaBongTable />;
      default:
        return <UserTable />;
    }
  };
  return (
    <div className="HomeAdmin-container">
      <Sidebar onItemSelect={handleItemSelect} />
      <div className="a-content">
        <Header />
        {/* <UserForm /> */}
        {renderContent()}
      </div>
    </div>
  );
}

export default HomeAdmin;
