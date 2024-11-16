import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './GiaoCa.scss';

const GiaoCaScreen = () => {
  const location = useLocation();
  const userId = location.state?.userId || '';

  const [employees, setEmployees] = useState([]);
  const [shiftData, setShiftData] = useState({
    tienbandau: 0,
    idusergiaoca: userId,
    tienphatsinh: 0,
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [handoverData, setHandoverData] = useState({
    timenhanca: '',
    nvhientai: '',
    phone: '',
    hoadonthanhtoan: 0,
    hoadonchuathanhtoan: 0,
    tongtientttienmat: 0,
    tongtienttchuyenkhoan: 0,
  });

  // Fetch all employees
  useEffect(() => {
    axios.get('http://localhost:8080/getnhanvien')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  // Fetch shift handover data
  useEffect(() => {
    axios.get(`http://localhost:8080/getgiaoca/${userId}`)
      .then(response => {
        setHandoverData(response.data);
      })
      .catch(error => {
        console.error('Error fetching handover data:', error);
      });
  }, [userId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShiftData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const dataToPost = {
      ...shiftData,
      idusergiaoca: selectedEmployeeId || shiftData.idusergiaoca,
    };
    axios.post(`http://localhost:8080/giaoca/${userId}`, dataToPost)
      .then(response => {
        alert('Giao ca thành công');

      })
      .catch(error => {
        alert('Giao ca thất bại, vui lòng thử lại.');
        console.error('Error submitting shift data:', error);
      });
  };

  return (
    <div className="shift-handover-screen">
      <h2>Giao Dịch Trong Ca</h2>
      <div className="transaction-details">
        <div>
          <label>Thời gian nhận ca:</label>
          <input type="text" value={new Date(handoverData.timenhanca).toLocaleString()} disabled />
        </div>
        <div>
          <label>Thời gian hiện tại:</label>
          <input type="text" value={new Date().toLocaleString()} disabled />
        </div>
        <div>
          <label>Nhân viên ca hiện tại:</label>
          <input type="text" value={handoverData.nvhientai} disabled />
        </div>
        <div>
          <label>Điện thoại:</label>
          <input type="text" value={handoverData.phone} disabled />
        </div>
        <div>
          <label>Tiền ban đầu (1):</label>
          <input type="number" name="tienbandau" value={handoverData.tienbandau} onChange={handleInputChange} disabled/>
        </div>
        <div>
          <label>Tổng số hóa đơn đã thanh toán:</label>
          <input type="text" value={handoverData.hoadonthanhtoan} disabled />
        </div>
        <div>
          <label>Tổng số hóa đơn chưa thanh toán:</label>
          <input type="text" value={handoverData.hoadonchuathanhtoan} disabled />
        </div>
        <div>
          <label>Tiền phát sinh (2):</label>
          <input type="number" name="tienphatsinh" value={handoverData.tienphatsinh} onChange={handleInputChange} />
        </div>
        <div>
          <label>Ghi chú:</label>
          <textarea name="ghichu" />
        </div>
      </div>

      <h2>Bàn Giao Ca</h2>
      <div className="handover-section">
        <label>Nhân viên nhận ca:</label>
        <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
          <option value="">Chọn nhân viên</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.hovaten} - {employee.phone}
            </option>
          ))}
        </select>

        <div>
          <label>Tổng tiền trong ca (1) + (3) + (4) - (2):</label>
          <input type="text" value={
            parseFloat(handoverData.tienbandau || 0) + 
            parseFloat(handoverData.tongtientttienmat) + 
            parseFloat(handoverData.tongtienttchuyenkhoan) - 
            parseFloat(shiftData.tienphatsinh || 0)
          } disabled />
        </div>

        <button onClick={handleSubmit}>Giao Ca</button>
      </div>
    </div>
  );
};

export default GiaoCaScreen;
