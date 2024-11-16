import React, { useState } from 'react'
import './Sidebar.scss'

function Sidebar ({ onItemSelect }) {
  const [activeItem, setActiveItem] = useState(null)
  const menuItems = [
    { id: 1, label: 'Quản Lý Tài Khoản Nhân Viên', dataKey: 'staffManagement' },
    { id: 2, label: 'Quản Lý Sân Bóng', dataKey: 'fieldManagement' },
    { id: 3, label: 'Quản Lý Luật Sân', dataKey: 'rulesManagement' },
    { id: 4, label: 'Quản Lý Giao Ca', dataKey: 'shiftManagement' },
    { id: 5, label: 'Quản Lý Tham Số', dataKey: 'parameterManagement' },
    { id: 6, label: 'Quản Lý Đồ Thuê', dataKey: 'equipmentManagement' },
    { id: 7, label: 'Quản Lý Nước Uống', dataKey: 'beverageManagement' },
    { id: 8, label: 'Quản Lý Ca', dataKey: 'quanlyca' },
    { id: 9, label: 'Lịch sử giao dịch', dataKey: 'lichsu' }
  ]

  const handleClick = item => {
    setActiveItem(item.id)
    onItemSelect(item.dataKey) // Pass dataKey to App component to display relevant data
  }

  return (
    <div className='sidebar'>
      <h3>Quản lý tài khoản</h3>
      <ul>
        {menuItems.map(item => (
          <li
            key={item.id}
            className={activeItem === item.id ? 'active' : ''}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
