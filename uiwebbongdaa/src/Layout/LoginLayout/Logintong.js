import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Logintong.scss'
// import { publicRoutes } from '../../router'

function Logintong () {
  const navigate = useNavigate()

  return (
    <div className='divlogintong'>
      <div className='tieudebongda'>
        <img
          src={require('../../assets/images/bongda2.png')}
          alt='Logo'
          className='imgbongda'
        />
        <div className='texttieude'>
          <h1 className='h1bongda'>HELLO</h1>
          <h1 className='h2bongda'>STADIUM</h1>
        </div>
      </div>

      <div className='loichao'>
        <h1 className='h1loichao'>Chào mừng bạn đến với sân bóng Hello</h1>
        <h1 className='h2loichao'>Bạn là ai?</h1>
      </div>

      <div className='divbtnlogin'>
        <button
          className='btnlogin'
          onClick={() => {
            navigate('/login', { state: { role: 'user' } })
          }}
        >
          Người dùng
        </button>
        <button
          className='btnlogin'
          onClick={() => {
            navigate('/login', { state: { role: 'staff' } })
          }}
        >
          Nhân viên
        </button>
        <button
          className='btnlogin'
          onClick={() => {
            navigate('/login', { state: { role: 'admin' } })
          }}
        >
          Chủ sân
        </button>
      </div>
    </div>
  )
}

export default Logintong
