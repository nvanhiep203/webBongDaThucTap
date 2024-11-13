import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CaBongTable() {
  const [shifts, setShifts] = useState([]);
  const [formData, setFormData] = useState({ tenca: '', begintime: '', endtime: '', giaca: '', trangthai: '' });
  const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getCa');
      setShifts(response.data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  const handleAddShift = async () => {
    try {
      await axios.post('http://localhost:8080/postca', formData);
      fetchShifts();
      setFormData({ tenca: '', begintime: '', endtime: '', giaca: '', trangthai: '' });
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  };

  const handleEditShift = async () => {
    if (!selectedShift) return;
    try {
      await axios.post(`http://localhost:8080/updateca/${selectedShift}`, formData);
      fetchShifts();
      setFormData({ tenca: '', begintime: '', endtime: '', giaca: '', trangthai: '' });
      setSelectedShift(null);
    } catch (error) {
      console.error('Error editing shift:', error);
    }
  };

  const handleDeleteShift = async (_id) => {
    try {
      await axios.post(`http://localhost:8080/deleteca/${_id}`);
      fetchShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditButtonClick = (shift) => {
    setSelectedShift(shift._id);
    setFormData({ tenca: shift.tenca, begintime: shift.begintime, endtime: shift.endtime, giaca: shift.giaca, trangthai: shift.trangthai });
  };
  const resetForm = () => {
    setFormData({ tenca: '', begintime: '', endtime: '', giaca: '', trangthai: '' });
    setSelectedShift(null);
  };

  return (
    <div>
      <h1>Quản lý ca</h1>
      
      <form onSubmit={(e) => { e.preventDefault(); selectedShift ? handleEditShift() : handleAddShift(); }}>
        <input type="text" name="tenca" placeholder="Tên ca" value={formData.tenca} onChange={handleFormChange} />
        <input type="time" name="begintime" placeholder="Begin Time" value={formData.begintime} onChange={handleFormChange} />
        <input type="time" name="endtime" placeholder="End Time" value={formData.endtime} onChange={handleFormChange} />
        <input type="number" name="giaca" placeholder="Giá ca" value={formData.giaca} onChange={handleFormChange} />
        <input type="text" name="trangthai" placeholder="Trạng thái" value={formData.trangthai} onChange={handleFormChange} />
        
        <button type="submit">{selectedShift ? 'Sửa Ca' : 'Thêm Ca'}</button>
        
        {selectedShift && (
          <button type="button" onClick={resetForm}>Hủy</button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>Tên ca</th>
            <th>Begin Time</th>
            <th>End Time</th>
            <th>Giá ca</th>
            <th>Trạng thái</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift._id}>
              <td>{shift.tenca}</td>
              <td>{shift.begintime}</td>
              <td>{shift.endtime}</td>
              <td>{shift.giaca}</td>
              <td>{shift.trangthai}</td>
              <td>
                <button onClick={() => handleEditButtonClick(shift)}>Sửa</button>
                <button onClick={() => handleDeleteShift(shift._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CaBongTable;
