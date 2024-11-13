import React from 'react';

function UserForm() {
  return (
    <div className="user-form">
      <h3>Thông Tin</h3>
      <input type="text" placeholder="Email" />
      <input type="text" placeholder="Tài khoản" />
      <input type="password" placeholder="Mật Khẩu" />
      <input type="text" placeholder="Số điện thoại" />
      <button>Lưu</button>
    </div>
  );
}

export default UserForm;
