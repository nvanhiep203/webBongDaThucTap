import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import './ModalThanhToanSuccess.scss'

function ModalThanhToanSuccess ({ isOpen, onClose, tiencoc, closeFullModal }) {
  const handleClose = () => {
    onClose()
    closeFullModal()
  }
  if (!isOpen) return null

  return (
    <>
      <div className='modal-overlay3'>
        <div className='modal-content3'>
          <div className='headerthanhtoansuccess'>
            <FontAwesomeIcon icon={faCheck} />
            <h3>Thanh toán thành công</h3>
          </div>
          <div className='bodythanhtoansuccess'>
            <div className='divgroup'>
              <p>Thông tin đơn hàng:</p>
              <p>Thanh toan tien coc dat lich san bong</p>
            </div>
            <div className='divgroup'>
              <p>Tổng tiền:</p>
              <p>{tiencoc.toLocaleString()} đ</p>
            </div>
            <div className='divgroup'>
              <p>Thời gian thanh toán:</p>
              <p>Thanh toan tien coc dat lich san bong</p>
            </div>
            <div className='divgroup'>
              <p>Mã giao dịch:</p>
              <p>523457345</p>
            </div>
          </div>
          <hr className='hrthanhtoansuccess' />
          <div className='divtextfootersuccess'>
            <p>Thanh toán của bạn đã thành công</p>
            <p>Cảm ơn đã tin tưởng sử dụng dịch vụ!</p>
          </div>

          <div className='divbtnthanhtoansuccess'>
            <button
              style={{
                marginTop: '10px',
                backgroundColor: 'rgb(1, 136, 46)',
                fontSize: '15px'
              }}
              onClick={handleClose}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalThanhToanSuccess
