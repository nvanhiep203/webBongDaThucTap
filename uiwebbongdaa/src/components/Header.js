import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom

function Header() {
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const handleLogout = () => {
    // Xóa token xác thực
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    // Chuyển hướng về trang đăng nhập
    navigate('/'); // Chuyển hướng đến trang login
  };
  const handleNavigateThongKe = () => {
  navigate('/thongke') // Chuyển hướng đến trang Thống Kê
}


  return (
    <div className="header">
      <h2>HELLO STADIUM</h2>
      <div >
        <span>Quản Lý</span>
        <span onClick={handleNavigateThongKe}>Thống Kê</span>
        <span>admin 1</span>
        <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Đăng xuất</button>
      </div>
    </div>
  );
}

export default Header;
