/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './ModalDoiLich.scss'
import ModalMessage from './ModalMessage'

function ModalDoiLich ({ idbooking, isOpen, onClose, fetchdata }) {
  const [data, setdata] = useState(null)
  const [dataca, setdataca] = useState([])
  const [selectedCa, setSelectedCa] = useState('')
  const [oldGiaca, setOldGiaca] = useState(0) // Lưu giá ca cũ
  const [giaChenhLech, setGiaChenhLech] = useState(0) // Lưu độ chênh lệch giá
  const [message, setmessage] = useState('')
  const [isOpenModalMessage, setisOpenModalMessage] = useState(false)

  const handledoilich = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/doilich/${idbooking}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idca: selectedCa
          })
        }
      )
      if (response.ok) {
        alert('đổi lịch thành công')
        fetchdata()
        onClose()
      }
    } catch (error) {
      alert('Đã xảy ra lỗi')
      console.log(error)
    }
  }

  const fetchchitiet = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getchitiebooking/${idbooking}`
      )
      const data = await response.json()
      if (response.ok) {
        setdata(data)
        setOldGiaca(data?.giaca || 0) // Lưu giá ca cũ
        console.log(data)
      }
    } catch (error) {
      alert('Đã xảy ra lỗi')
      console.log(error)
    }
  }

  const fetchca = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getcafull`)
      const data = await response.json()
      if (response.ok) {
        setdataca(data)
      }
    } catch (error) {
      alert('Đã xảy ra lỗi')
      console.log(error)
    }
  }

  const handleCaChange = e => {
    const selectedCaId = e.target.value
    setSelectedCa(selectedCaId)

    // Tìm thông tin của ca đã chọn
    const selectedCaData = dataca.find(ca => ca._id === selectedCaId)

    if (selectedCaData) {
      // Cập nhật giá sân và tiền cọc theo ca đã chọn
      setdata(prevData => ({
        ...prevData,
        giaca: selectedCaData.giaca,
        tiencoc: selectedCaData.giaca / 2
      }))

      // Tính độ chênh lệch giữa giá ca cũ và ca mới
      const chenhLech = (selectedCaData.giaca - oldGiaca) / 2
      setGiaChenhLech(chenhLech) // Cập nhật độ chênh lệch giá
    }
  }

  useEffect(() => {
    if (idbooking) {
      fetchchitiet()
    }
  }, [idbooking])

  useEffect(() => {
    fetchca()
  }, [])

  const hanldeclickdoilich = () => {
    if (giaChenhLech === 0) {
      handledoilich()
    } else if (giaChenhLech > 0) {
      setmessage('thêm cọc')
      setisOpenModalMessage(true)
    } else if (giaChenhLech < 0) {
      setmessage('hoàn tiền')
      setisOpenModalMessage(true)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className='modal-overlay'>
        <div className='modal-content'>
          <div className='bodydoilich'>
            <label htmlFor=''>Loại sân</label>
            <input type='text' value={data?.loaisanbong || ''} disabled />
            <label htmlFor=''>Ca hiện tại</label>
            <input type='text' value={data?.ca || ''} disabled />
            <label htmlFor='ca'>Chọn ca mới</label>
            <select id='ca' value={selectedCa} onChange={handleCaChange}>
              <option value=''>-- Chọn ca --</option>
              {dataca.map(ca => (
                <option key={ca._id} value={ca._id}>
                  {`${ca.tenca} (${ca.begintime} - ${ca.endtime})`}
                </option>
              ))}
            </select>
            <label htmlFor=''>Số lượng sân</label>
            <input type='text' value={data?.soluongsan || ''} disabled />
            <label htmlFor=''>Giá sân</label>
            <input type='text' value={data?.giaca || ''} disabled />
            <label htmlFor=''>Tiền cọc</label>
            <input type='text' value={data?.tiencoc || ''} disabled />
            <label htmlFor=''>Thêm cọc/Hoàn tiền</label>
            <input
              type='text'
              value={giaChenhLech === 0 ? '0' : giaChenhLech}
              disabled
            />
          </div>
          <button onClick={hanldeclickdoilich}>Đổi lịch</button>
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
      <ModalMessage
        isOpen={isOpenModalMessage}
        onClose={() => {
          setisOpenModalMessage(false)
          onClose()
        }}
        message={message}
        tiencoc={giaChenhLech}
        handledoilich={handledoilich}
      />
    </>
  )
}

export default ModalDoiLich
