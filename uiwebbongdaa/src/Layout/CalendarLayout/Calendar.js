/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './Calendar.scss'
import ModalDatLich from './ModalDatLich'
import ModalDatSan from './ModalDatSan'
import ModalHuySan from './ModalHuySan'
import ModalDoiLich from './ModalDoiLich'
import { useLocation } from 'react-router-dom'

function Calendar () {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalDatSanOpen, setIsModalDatSanOpen] = useState(false)
  const [bookingDays, setBookingDays] = useState([]) // Thêm state để lưu các ngày có ca đặt
  const [bookingDetails, setBookingDetails] = useState([]) // Lưu thông tin các ca đã đặt
  const [datadatlich, setdatadatlich] = useState([])
  const [isOpenModalHuySan, setisOpenModalHuySan] = useState(false)
  const [idbooking, setidbooking] = useState('')
  const [isOpenModalDoiLich, setisModalDoiLich] = useState(false)

  const location = useLocation()
  const userId = location.state?.userId || ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const fetchBookingDays = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getbookingdays/${userId}`
      )
      if (response.ok) {
        const data = await response.json()
        setBookingDays(data)
      } else {
        console.error('Failed to fetch booking days')
      }
    } catch (error) {
      console.error('Error fetching booking days:', error)
    }
  }

  const fetchdatlich = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/getbooking/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setdatadatlich(data)
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchBookingDetails = async date => {
    try {
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      const response = await fetch(
        `http://localhost:8080/getbookingdetails/${userId}/${formattedDate}`
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setBookingDetails(data)
      } else {
        console.error('Failed to fetch booking details')
      }
    } catch (error) {
      console.error('Error fetching booking details:', error)
    }
  }

  useEffect(() => {
    fetchBookingDays()
    fetchdatlich()
  }, [userId])

  const renderCalendar = () => {
    const monthDays = []
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    )
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    )
    const startDay = startOfMonth.getDay()
    const totalDays = endOfMonth.getDate()

    for (let i = 0; i < startDay; i++) {
      monthDays.push(<div className='day empty' key={`empty-${i}`}></div>)
    }

    for (let day = 1; day <= totalDays; day++) {
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      )
      const isBooked = bookingDays.some(
        bookingDay =>
          new Date(bookingDay).toDateString() === currentDay.toDateString()
      )

      monthDays.push(
        <div
          className={`day ${isBooked ? 'booked' : ''}`} // Thêm class 'booked' nếu ngày có ca đặt
          key={day}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      )
    }

    return monthDays
  }

  const handleDayClick = day => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
    clickedDate.setHours(0, 0, 0, 0)
    console.log(clickedDate)

    if (clickedDate < today) {
      alert('Bạn không thể chọn ngày trong quá khứ')
      return
    }

    const isBooked = bookingDays.some(
      bookingDay =>
        new Date(bookingDay).toDateString() === clickedDate.toDateString()
    )

    if (isBooked) {
      fetchBookingDetails(clickedDate)
      setSelectedDate(clickedDate)
    } else {
      setSelectedDate(clickedDate)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
  }

  const closeModalDatSan = () => {
    setIsModalDatSanOpen(false)
  }

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const handelxoabooking = async (idbooking, date) => {
    try {
      console.log(date)
      const response = await fetch(
        `http://localhost:8080/deletebooking/${idbooking}/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (response.ok) {
        fetchBookingDays()
        fetchBookingDetails(date)
        fetchdatlich()
        alert('xóa lịch thành công')
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Lỗi khi lưu đặt lịch sân:', error)
    }
  }

  const getBookingStatus = bookingDetail => {
    if (bookingDetail.coc === false) {
      return 'chưa đặt cọc'
    } else if (bookingDetail.coc && bookingDetail.checkin === false) {
      return 'Đã đặt cọc'
    } else if (bookingDetail.checkin && bookingDetail.thanhtoan) {
      return 'Đang Đá'
    } else {
      return 'Đã thanh toán'
    }
  }

  const getBookingbutton = bookingDetail => {
    if (bookingDetail.coc === false) {
      return (
        <>
          <button
            onClick={() => handelxoabooking(bookingDetail._id, selectedDate)}
          >
            xóa
          </button>
        </>
      )
    } else if (bookingDetail.coc && bookingDetail.checkin === false) {
      return (
        <>
          <button
            onClick={() => {
              setisOpenModalHuySan(true)
              setidbooking(bookingDetail._id)
            }}
          >
            hủy sân
          </button>
          <button
            onClick={() => {
              setisModalDoiLich(true)
              setidbooking(bookingDetail._id)
            }}
          >
            đổi lịch
          </button>
        </>
      )
    } else if (bookingDetail.checkin && bookingDetail.thanhtoan) {
      return
    } else {
      return
    }
  }

  const shouldShowChucNangColumn = bookingDetails.some(
    bookingDetail =>
      bookingDetail.coc === false ||
      (bookingDetail.coc && bookingDetail.checkin === false)
  )

  return (
    <div className='divcalendartong'>
      <div className='calendar'>
        <button onClick={() => setIsModalDatSanOpen(true)}>Đặt sân</button>
        <button
          className='nut'
          onClick={() => {
            localStorage.removeItem('authToken')
            sessionStorage.removeItem('authToken')
            window.location.href = 'http://localhost:3000'
          }}
        >
          Đăng xuất
        </button>
        <div className='headercalendar'>
          <button onClick={prevMonth}>Previous</button>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' })}{' '}
            {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth}>Next</button>
        </div>
        <div className='weekdays'>
          {['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'].map(day => (
            <div className='weekday' key={day}>
              {day}
            </div>
          ))}
        </div>
        <div className='days'>{renderCalendar()}</div>

        <ModalDatLich
          isOpen={isModalOpen}
          onClose={closeModal}
          date={selectedDate}
          userId={userId}
          fetchBookingDays={fetchBookingDays}
          fetchdatlich={fetchdatlich}
        />
        <ModalDatSan
          isOpen={isModalDatSanOpen}
          onClose={closeModalDatSan}
          userId={userId}
          datadatlich={datadatlich}
          fetchdatlich={fetchdatlich}
        />
        <ModalHuySan
          isOpen={isOpenModalHuySan}
          onClose={() => setisOpenModalHuySan(false)}
          idbooking={idbooking}
          fetchdata={() => {
            fetchdatlich()
            fetchBookingDays()
            fetchBookingDetails(selectedDate)
          }}
          userId={userId}
        />
        <ModalDoiLich
          isOpen={isOpenModalDoiLich}
          onClose={() => setisModalDoiLich(false)}
          idbooking={idbooking}
          fetchdata={() => {
            fetchdatlich()
            fetchBookingDays()
            fetchBookingDetails(selectedDate)
          }}
        />
      </div>
      <div className='divtablecalendartong'>
        <h3>Sự kiện</h3>
        <table>
          <thead>
            <tr>
              <th>Loại sân</th>
              <th>Ca</th>
              <th>Số lượng sân</th>
              <th>Giá</th>
              <th>Tiền cọc</th>
              <th>Trạng thái</th>
              {shouldShowChucNangColumn && <th>Chức năng</th>}
            </tr>
          </thead>
          <tbody>
            {bookingDetails.map((bookingDetail, index) => (
              <tr key={index}>
                <td>{bookingDetail.loaisanbong}</td>
                <td>{`${bookingDetail.ca} (${bookingDetail.begintime} - ${bookingDetail.endtime})`}</td>
                <td>{bookingDetail.soluongsan}</td>
                <td>{bookingDetail.giaca.toLocaleString()} đ</td>
                <td>{bookingDetail.tiencoc.toLocaleString()} đ</td>
                <td>{getBookingStatus(bookingDetail)}</td>
                {shouldShowChucNangColumn && (
                  <td>{getBookingbutton(bookingDetail)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Calendar
