/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './ModalThanhToan.scss'
import ModalThanhToanSuccess from './ModalThanhToanSuccess'

function ModalThanhToan ({
  isOpen,
  onClose,
  tennguoidat,
  phone,
  datadatlich,
  tiencoc,
  tennganhang,
  fetchdatlich,
  closeFullModal
}) {
  const [sothe, setsothe] = useState('')
  const [tenchuthe, settenchuthe] = useState('')
  const [ngayphat, setngayphat] = useState('')

  const [sotheError, setsotheError] = useState('')
  const [tenchutheError, settenchutheError] = useState('')
  const [ngayphatError, setngayphatError] = useState('')
  const [isOpenSuccess, setIsOpenSuccess] = useState(false)

  const [initialTienCoc, setInitialTienCoc] = useState(tiencoc)

  // Lưu giá trị tiencoc ban đầu khi component mount
  useEffect(() => {
    setInitialTienCoc(tiencoc)
  }, [])

  const idbooking = datadatlich.map(item => item._id)

  const validateInputs = () => {
    let valid = true

    if (!sothe) {
      setsotheError('Vui lòng nhập số thẻ')
      valid = false
    } else {
      setsotheError('')
    }

    if (!tenchuthe) {
      settenchutheError('Vui lòng nhập tên chủ thẻ')
      valid = false
    } else {
      settenchutheError('')
    }

    if (!ngayphat) {
      setngayphatError('Vui lòng nhập ngày phát')
      valid = false
    } else {
      setngayphatError('')
    }

    return valid
  }

  const handelDatCoc = async () => {
    if (validateInputs()) {
      try {
        const response = await fetch(`http://localhost:8080/datcocsan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tennguoidat: tennguoidat,
            phone: phone,
            idbookings: idbooking
          })
        })

        if (response.ok) {
          fetchdatlich()
          setIsOpenSuccess(true)
        } else {
          alert('lỗi đặt cọc')
        }
      } catch (error) {
        console.error('Lỗi khi đặt cọc:', error)
      }
    }
  }
  const handleClose = () => {
    onClose()
    closeFullModal()
  }
  if (!isOpen) return null

  return (
    <>
      <div className='modal-overlay2'>
        <div className='modal-content2'>
          <img src='/logovnpay.png' alt='' className='imgvnpay' />
          <hr />
          <div className='bodythanhtoan'>
            <div className='divthongtinthanhtoan'>
              <p className='titlethongtintt'>Thông tin đơn hàng</p>
              <hr style={{ width: '100%', border: '1px solid gray' }} />

              <p className='pthongtintt'>Số tiền thanh toán</p>
              <h3 className='h3thongtintt'>
                {initialTienCoc.toLocaleString()} VND
              </h3>

              <p className='pthongtintt'>Giá trị đơn hàng</p>
              <h3>{initialTienCoc.toLocaleString()} VND</h3>

              <p className='pthongtintt'>Phí giao dịch</p>
              <h3>0 VND</h3>

              <p className='pthongtintt'>Mã đơn hàng</p>
              <h3>88712312</h3>

              <p className='pthongtintt'>Nhà cung cấp</p>
              <h3>Công ty CTT HTT1</h3>
            </div>
            <div className='divinputthanhtoantong'>
              <p className='titlethongtintt'>
                Thanh toán qua ngân hàng {tennganhang}
              </p>
              <p style={{ marginTop: '10px', marginBottom: '10px' }}>
                Thẻ nội địa
              </p>

              <hr />
              <div className='divinputthanhtoan'>
                <p>Số thẻ</p>
                <input
                  type='text'
                  placeholder='Nhập số thẻ'
                  value={sothe}
                  onChange={e => {
                    setsothe(e.target.value)
                    setsotheError('')
                  }}
                />
                {sotheError && <p className='error'>{sotheError}</p>}

                <p>Tên chủ thẻ</p>
                <input
                  type='text'
                  placeholder='Nhập tên chủ thẻ'
                  value={tenchuthe}
                  onChange={e => {
                    settenchuthe(e.target.value)
                    settenchutheError('')
                  }}
                />
                {tenchutheError && <p className='error'>{tenchutheError}</p>}

                <p>Ngày phát hành</p>
                <input
                  type='text'
                  placeholder='MM/YY'
                  value={ngayphat}
                  onChange={e => {
                    setngayphat(e.target.value)
                    setngayphatError('')
                  }}
                />
                {ngayphatError && <p className='error'>{ngayphatError}</p>}
              </div>
            </div>
          </div>
          <div className='divbtnthanhtoan'>
            <button
              style={{
                marginTop: '10px',
                fontSize: '20px'
              }}
              onClick={handelDatCoc}
            >
              Thanh toán
            </button>
            <button className='btnhuythanhtoan' onClick={onClose}>
              Hủy thanh toán
            </button>
          </div>
        </div>
      </div>
      <ModalThanhToanSuccess
        isOpen={isOpenSuccess}
        onClose={() => setIsOpenSuccess(false)}
        tiencoc={initialTienCoc}
        closeFullModal={handleClose}
      />
    </>
  )
}

export default ModalThanhToan
