import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ThamSoTable.scss';

const ThamSoTable = () => {
  const [thamsoList, setThamsoList] = useState([]);
  const [newThamso, setNewThamso] = useState({ chucnang: '', type: '', giatri: '', ghichu: '' });
  const [editingThamso, setEditingThamso] = useState(null); // Trạng thái lưu thông tin tham số đang được sửa

  useEffect(() => {
    fetchThamsoData();
  }, []);

  // Fetch data
  const fetchThamsoData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getthamso');
      setThamsoList(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Add new thamso
  const addThamso = async () => {
    try {
      await axios.post('http://localhost:8080/postthamso', newThamso);
      fetchThamsoData(); // Refresh list
      setNewThamso({ chucnang: '', type: '', giatri: '', ghichu: '' }); // Reset form
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  // Handle edit button click
  const startEditing = (item) => {
    setEditingThamso(item); // Đặt tham số đang được sửa
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingThamso(null); // Hủy trạng thái chỉnh sửa
  };

  // Save edited thamso
  const saveThamso = async () => {
    try {
      await axios.post(`http://localhost:8080/putthamso/${editingThamso._id}`, editingThamso);
      fetchThamsoData();
      setEditingThamso(null); // Đóng form chỉnh sửa
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Delete thamso
  const deleteThamso = async (id) => {
    try {
      await axios.post(`http://localhost:8080/deletethamso/${id}`);
      fetchThamsoData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="single-screen">
      <h2>Danh Sách Tham Số</h2>
      <table className="parameter-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Chức Năng</th>
            <th>Mã Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Ghi Chú</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {thamsoList.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.chucnang}</td>
              <td>{item.maCode}</td>
              <td>{item.type}</td>
              <td>{item.giatri}</td>
              <td>{item.ghichu}</td>
              <td>Hoạt động</td>
              <td>
                <button onClick={() => startEditing(item)}>Sửa</button>
                <button onClick={() => deleteThamso(item._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingThamso && (
        <div className="edit-form">
          <h3>Chỉnh Sửa Tham Số</h3>
          <input
            type="text"
            placeholder="Chức năng"
            value={editingThamso.chucnang}
            onChange={(e) => setEditingThamso({ ...editingThamso, chucnang: e.target.value })}
          />
          <select
            value={editingThamso.type}
            onChange={(e) => setEditingThamso({ ...editingThamso, type: e.target.value })}
          >
            <option value="phút">Phút</option>
            <option value="giờ">Giờ</option>
            <option value="ngày">Ngày</option>
            <option value="%">%</option>
          </select>
          <input
            type="number"
            placeholder="Value"
            value={editingThamso.giatri}
            onChange={(e) => setEditingThamso({ ...editingThamso, giatri: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ghi chú"
            value={editingThamso.ghichu}
            onChange={(e) => setEditingThamso({ ...editingThamso, ghichu: e.target.value })}
          />
          <button onClick={saveThamso}>Lưu</button>
          <button onClick={cancelEditing}>Hủy</button>
        </div>
      )}

      <div className="add-form">
        <h3>Thêm Tham Số</h3>
        <input
          type="text"
          placeholder="Chức năng"
          value={newThamso.chucnang}
          onChange={(e) => setNewThamso({ ...newThamso, chucnang: e.target.value })}
        />
        <select
          value={newThamso.type}
          onChange={(e) => setNewThamso({ ...newThamso, type: e.target.value })}
        >
          <option value="">Chọn loại</option>
          <option value="phút">Phút</option>
          <option value="giờ">Giờ</option>
          <option value="ngày">Ngày</option>
          <option value="%">%</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          value={newThamso.giatri}
          onChange={(e) => setNewThamso({ ...newThamso, giatri: e.target.value })}
        />
        <input
          type="text"
          placeholder="Ghi chú"
          value={newThamso.ghichu}
          onChange={(e) => setNewThamso({ ...newThamso, ghichu: e.target.value })}
        />
        <button onClick={addThamso}>Thêm</button>
      </div>
    </div>
  );
};

export default ThamSoTable;
