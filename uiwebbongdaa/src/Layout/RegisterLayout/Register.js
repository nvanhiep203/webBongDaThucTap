import React, { useState } from 'react'
import './Register.scss'
import { useNavigate } from 'react-router-dom'

function Register () {
  const [hovaten, sethovaten] = useState('')
  const [email, setemail] = useState('')

  const [phone, setphone] = useState('')

  const [password, setpassword] = useState('')

  const [passwordError, setpasswordError] = useState('')
  const [emailError, setemailError] = useState('')
  const [phoneError, setphoneError] = useState('')
  const [hovatenError, sethovatenError] = useState('')

  const navigate = useNavigate()
  const validateInputs = () => {
    let valid = true

    if (!hovaten) {
      sethovatenError('Vui lòng nhập họ và tên.')
      valid = false
    } else {
      sethovatenError('')
    }

    if (!email) {
      setemailError('Vui lòng nhập email')
      valid = false
    } else {
      setemailError('')
    }

    if (!phone) {
      setphoneError('Vui lòng nhập số điện thoại')
      valid = false
    } else {
      setphoneError('')
    }

    if (!password) {
      setpasswordError('vui lòng nhập mật khẩu')
      valid = false
    } else {
      setpasswordError('')
    }

    return valid
  }

  const handleRegister = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(`http://localhost:8080/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            hovaten: hovaten,
            email: email,
            phone: phone,
            password: password
          })
        })
        const data = await response.json()
        if (data.message) {
          alert(data.message)
        } else {
          const confirmed = window.confirm(
            'Đăng ký người dùng thành công. Nhấn OK để về trang đăng nhập.'
          )
          if (confirmed) {
            navigate('/')
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className='register-container'>
      <h2 className='register-title'>Đăng ký người dùng</h2>
      <input
        type='text'
        placeholder='Họ và tên'
        name='hovaten'
        value={hovaten}
        onChange={e => sethovaten(e.target.value)}
      />
      <br />
      <input
        type='email'
        placeholder='Email'
        name='email'
        value={email}
        onChange={e => setemail(e.target.value)}
      />
      <br />
      <input
        type='text'
        placeholder='Số điện thoại'
        name='phone'
        value={phone}
        onChange={e => setphone(e.target.value)}
      />
      <br />
      <input
        type='password'
        placeholder='Mật khẩu'
        name='password'
        value={password}
        onChange={e => setpassword(e.target.value)}
      />
      <br />
      <button onClick={handleRegister}>Đăng ký</button>
    </div>
  )
}

export default Register
