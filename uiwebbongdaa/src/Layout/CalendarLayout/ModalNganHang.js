import React, { useEffect, useState } from 'react'
import './ModalNganHang.scss'
import ModalThanhToan from './ModalThanhToan'

function ModalNganHang ({
  isOpen,
  onClose,
  tennguoidat,
  phone,
  datadatlich,
  tiencoc,
  fetchdatlich,
  closeModaldDatSan
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
    closeModaldDatSan()
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
      <ModalThanhToan
        isOpen={isModalThanhToanOpen}
        onClose={() => setIsModalThanhToanOpen(false)}
        tennguoidat={tennguoidat}
        phone={phone}
        datadatlich={datadatlich}
        tiencoc={tiencoc}
        tennganhang={tennganhang}
        fetchdatlich={fetchdatlich}
        closeFullModal ={handleclose}
      />
    </>
  )
}

export default ModalNganHang
