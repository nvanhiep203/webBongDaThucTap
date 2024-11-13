import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CheckInScreen.scss';

const CheckInScreen = () => {
  const [sanList, setSanList] = useState([]);  // Danh sách sân chờ check-in
  const [checkinList, setCheckinList] = useState([]);  // Danh sách sân đã check-in
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy danh sách sân chờ check-in
  useEffect(() => {
    fetchSanList();
  }, []);

  const fetchSanList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getdacoc');
      setSanList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Lấy danh sách sân đã check-in
  const fetchCheckinList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/checkin');
      setCheckinList(response.data);
    } catch (error) {
      console.error('Error fetching check-in data:', error);
    }
  };

  // Xử lý check-in
  const handleCheckIn = async (id) => {
    try {
      await axios.post(`http://localhost:8080/postcheckin/${id}`);
      setModalVisible(true); // Hiện modal xác nhận
      fetchSanList(); // Làm mới danh sách sau khi check-in
    } catch (error) {
      console.error('Error during check-in:', error);
    }
  };

  return (
    <div className="checkin-screen">
      <h2>Nhân Viên Check In</h2>
      <div className="search-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo số điện thoại"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={fetchCheckinList} className="btn-checked-list">
          Danh Sách Đã Check In
        </button>
      </div>

      {/* Bảng sân chờ check-in */}
      <h3>Danh Sách Sân Chờ Check-In</h3>
      <table className="checkin-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và Tên</th>
            <th>Số Điện Thoại</th>
            <th>Tên Sân Bóng</th>
            <th>Tên Ca</th>
            <th>Tiền Sân</th>
            <th>Ngày Đến Sân</th>
            <th>Thời Gian</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {sanList.length > 0 ? (
            sanList.map((item, index) => (
              <tr key={item._id || index}>
                <td>{index + 1}</td>
                <td>{item.hovaten}</td>
                <td>{item.phone}</td>
                <td>{item.loaisanbong}</td>
                <td>{item.ca}</td>
                <td>
                  {item.giaca
                    ? item.giaca.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                    : 'Chưa có dữ liệu'}
                </td>
                <td>{item.ngayda}</td>
                <td>{item.begintime} - {item.endtime}</td>
                <td>
                  <button onClick={() => handleCheckIn(item._id)} className="btn-checkin">
                    Check In
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Không có dữ liệu check-in</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bảng sân đã check-in */}
      {checkinList.length > 0 && (
        <>
          <h3>Danh Sách Sân Đã Check-In</h3>
          <table className="checkin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và Tên</th>
                <th>Số Điện Thoại</th>
                <th>Tên Sân Bóng</th>
                <th>Tên Ca</th>
                <th>Tiền Cọc</th>
                <th>Ngày Đến Sân</th>
              </tr>
            </thead>
            <tbody>
              {checkinList.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>
                  <td>{item.hovaten}</td>
                  <td>{item.phone}</td>
                  <td>{item.loaisanbong}</td>
                  <td>{item.ca}</td>
                  <td>
                    {item.giaca
                      ? item.giaca.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                      : 'Chưa có dữ liệu'}
                  </td>
                  <td>{item.ngayda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Modal thông báo check-in thành công */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <p>Check-in thành công!</p>
            <button onClick={() => setModalVisible(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInScreen;
