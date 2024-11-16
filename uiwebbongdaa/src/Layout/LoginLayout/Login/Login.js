import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Login.scss'

function Login () {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [passwordError, setpasswordError] = useState('')
  const [emailError, setemailError] = useState('')

  const location = useLocation()
  const role = location.state?.role || 'defaultRole'

  const navigate = useNavigate()
  const validateInputs = () => {
    let valid = true

    if (!email) {
      setemailError('Vui lòng nhập email')
      valid = false
    } else {
      setemailError('')
    }

    if (!password) {
      setpasswordError('vui lòng nhập mật khẩu')
      valid = false
    } else {
      setpasswordError('')
    }

    return valid
  }

  const handleLogin = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(`http://localhost:8080/loginfull`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            role: role
          })
        })
        const data = await response.json()

        if (data) {
          if (data.message) {
            window.confirm(data.message)
          } else {
            if (role === 'admin') {
              navigate('/admin')
            } else if (role === 'user') {
              navigate('/calendar', { state: { userId: data.user._id } })
            } else {
              if (data.nhanca !== undefined) {
                console.log(data.nhanca)
                navigate('/nhanvien', {
                  state: {
                    nhanca: data.nhanca,
                    userId: data.user._id,
                    khoitaoca: false
                  }
                })
              } else {
                navigate('/nhanvien', {
                  state: { khoitaoca: true, userId: data.user._id }
                })
              }
            }
          }
        } else {
          window.confirm(data.message || 'Đăng nhập không thành công')
        }
      } catch (error) {
        console.log(error)
        window.confirm('Đăng nhập lỗi')
      }
    }
  }

  return (
    <div className='register-container'>
      <h2 className='register-title'>Đăng nhập</h2>
      <input
        type='email'
        placeholder='Email'
        name='email'
        value={email}
        onChange={e => setemail(e.target.value)}
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
      <button onClick={handleLogin}>Đăng nhập</button>
      {role === 'user' && (
        <div className='divfooterdk'>
          <p>
            Bạn chưa có tài khoản? <a href='/register'>Đăng ký</a>
          </p>
        </div>
      )}
    </div>
  )
}

export default Login
