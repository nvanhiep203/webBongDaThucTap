import React, { useState, useEffect } from 'react';

function GiaoCaTable() {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hovaten, setHovaten] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch users from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/getnhanvien'); // Adjust the URL as needed
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const response = await fetch(`http://localhost:8080/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hovaten: hovaten,
          email: email,
          phone: phone,
          password: password,
          role: 'staff',
        }),
      });
      if (response.ok) {
        const newUser = { hovaten: hovaten, email, phone};
        setUsers([...users, newUser]);
        setShowAddForm(false);
        alert('Đăng ký người dùng thành công.');
      }
    } catch (error) {
      console.log(error);
      alert('Có lỗi xảy ra khi đăng ký người dùng.');
    }
  };

  return (
    <div className="user-table">
      
      <button onClick={() => setShowAddForm(true)}>Thêm Nhân Viên</button>

      {showAddForm && (
        <div className="add-form">
          <h4>Thêm Nhân Viên Mới</h4>
          <input type="text" placeholder="Họ và tên" value={hovaten} onChange={e => setHovaten(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="text" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleAddEmployee}>Xác nhận</button>
          <button onClick={() => setShowAddForm(false)}>Hủy</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Image</th>
            <th>Giao Ca</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id || index}>
              <td>{index + 1}</td>
              <td>{user.hovaten}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>Chưa cập nhật</td>
              <td>
              {user.trangthai}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    
    </div>
  );
}

export default GiaoCaTable;
