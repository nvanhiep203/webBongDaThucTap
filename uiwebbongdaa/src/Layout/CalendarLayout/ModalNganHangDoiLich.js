import React, { useEffect, useState } from 'react'
import ModalThanhToanDoilich from './ModalThanhToanDoiLich'
function ModalNganHangDoiLich ({
  isOpen,
  onClose,
  tiencoc,
  hadledoilich
}) {
  const [banks, setBanks] = useState([])
  const [tennganhang, settennganhang] = useState([])
  const [isModalThanhToanOpen, setIsModalThanhToanOpen] = useState(false)

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('https://api.vietqr.io/v2/banks')
        const data = await response.json()

        if (data.code === '00') {
          // Kiểm tra mã phản hồi thành công
          setBanks(data.data) // Lưu danh sách ngân hàng từ `data.data`
        } else {
        }
      } catch (err) {}
    }

    fetchBanks()
  }, [])

  const handleModalThanhToan = name => {
    setIsModalThanhToanOpen(true)
    settennganhang(name)
  }
  const handleclose = () => {
    onClose()
  }
  if (!isOpen) return null
  return (
    <>
      <div className='modal-overlay2'>
        <div className='modal-content2'>
          <img src='/logovnpay.png' alt='' className='imgvnpay' />
          <div className='bodynganhang'>
            <p className='titlenganhang'>Chọn phương thức thanh toán</p>
            <div className='divlistnganhang'>
              {banks.map(b => (
                <div
                  className='divnganhang'
                  onClick={() => handleModalThanhToan(b.shortName)}
                >
                  <img src={b.logo} alt='' className='imgnganhang' />
                </div>
              ))}
            </div>
          </div>
          <div>
            <button
              style={{
                width: '100%',
                marginTop: '10px',
                fontSize: '20px',
                backgroundColor: 'red'
              }}
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
      <ModalThanhToanDoilich
        isOpen={isModalThanhToanOpen}
        onClose={() => setIsModalThanhToanOpen(false)}
        tiencoc={tiencoc}
        tennganhang={tennganhang}
        hadledoilich={hadledoilich}
        closeFullModal={handleclose}
      />
    </>
  )
}

export default ModalNganHangDoiLich
