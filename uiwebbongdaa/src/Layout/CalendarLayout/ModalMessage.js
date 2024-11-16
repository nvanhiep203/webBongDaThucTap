import React, { useState } from 'react'
import ModalNganHangDoiLich from './ModalNganHangDoiLich'

function ModalMessage ({ message, handledoilich, isOpen, onClose, tiencoc }) {
  const [isOpenNganHang, setisOpenNganHang] = useState(false)
  const handlemessage = () => {
    if (message === 'thêm cọc') {
      return 'Bạn phải đặt thêm tiền cọc để đổi lịch'
    } else {
      return 'Giá sân giảm chúng tôi sẽ hoàn tiền cho bạn sớm nhất'
    }
  }

  const handlexacnhan = () => {
    if (message === 'thêm cọc') {
      setisOpenNganHang(true)
    } else {
      handledoilich()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className='modal-overlay'>
        <div className='modal-content'>
          <h2>Hủy sân</h2>
          <p>{handlemessage()}</p>
          <button onClick={handlexacnhan}>Xác nhận</button>
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
      <ModalNganHangDoiLich
        isOpen={isOpenNganHang}
        onClose={() => setisOpenNganHang(false)}
        tiencoc={tiencoc}
        hadledoilich={handledoilich}
      />
    </>
  )
}

export default ModalMessage
