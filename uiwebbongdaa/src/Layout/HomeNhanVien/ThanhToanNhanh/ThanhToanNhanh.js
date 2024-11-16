import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './ThanhToanNhanh.scss'

const ThanhToanNhanh = () => {
  const [invoices, setInvoices] = useState([]) // List of invoices from API
  const [services, setServices] = useState([]) // Combined list of drinks and rentals
  const [selectedInvoice, setSelectedInvoice] = useState(null) // Selected invoice
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility
  const [phuPhi, setPhuPhi] = useState(0)
  const [method, setMethod] = useState('') // Either 'tiền mặt' or 'chuyển khoản'
  const [tienKhachTra, setTienKhachTra] = useState(0)
  const [tienThua, setTienThua] = useState(0)
  const [soTaiKhoan, setSoTaiKhoan] = useState('')
  const [nganHang, setNganHang] = useState('')
  useEffect(() => {
    fetchInvoices()
    fetchServices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/gethoadon')
      setInvoices(response.data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const drinksResponse = await axios.get('http://localhost:8080/getdouong')
      const rentalsResponse = await axios.get('http://localhost:8080/getdothue')
      const combinedServices = [
        ...drinksResponse.data.map(drink => ({ ...drink, type: 'drink' })),
        ...rentalsResponse.data.map(rental => ({ ...rental, type: 'rental' }))
      ]
      setServices(combinedServices)
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const handleInvoiceSelect = invoice => {
    setSelectedInvoice(invoice)
  }

  const handleServiceSelect = async service => {
    if (!selectedInvoice) {
      alert('Vui lòng chọn hóa đơn trước khi chọn dịch vụ.')
      return
    }

    if (service.soluong <= 0) {
      alert('Số lượng trong kho đã hết!')
      return
    }

    try {
      const endpoint =
        service.type === 'drink'
          ? `http://localhost:8080/bandouong/${service._id}/${selectedInvoice.idhoadon}`
          : `http://localhost:8080/bandothue/${service._id}/${selectedInvoice.idhoadon}`

      await axios.post(endpoint, { soluong: service.soluong })
      alert('Dịch vụ đã được thêm vào hóa đơn thành công!')

      // Reload invoices and update selectedInvoice
      await fetchInvoices()
      const updatedInvoice = invoices.find(
        invoice => invoice.idhoadon === selectedInvoice.idhoadon
      )
      setSelectedInvoice(updatedInvoice)
    } catch (error) {
      console.error('Error adding service to invoice:', error)
      alert('Thêm dịch vụ vào hóa đơn thất bại!')
    }

    setIsModalOpen(false)
  }

  const handleRemoveService = async serviceId => {
    if (!selectedInvoice) {
      alert('Vui lòng chọn hóa đơn.')
      return
    }

    try {
      const isDrink = selectedInvoice.douong.some(
        service => service._id === serviceId
      )
      const isRental = selectedInvoice.dothue.some(
        service => service._id === serviceId
      )

      if (isDrink) {
        await axios.post(
          `http://localhost:8080/xoadouonghoadon/${serviceId}/${selectedInvoice.idhoadon}`
        )
        alert('Đồ uống đã được xóa khỏi hóa đơn!')
      } else if (isRental) {
        await axios.post(
          `http://localhost:8080/xoadothuehoadon/${serviceId}/${selectedInvoice.idhoadon}`
        )
        alert('Đồ thuê đã được xóa khỏi hóa đơn!')
      } else {
        alert('Dịch vụ không tồn tại trong hóa đơn.')
        return
      }

      // Reload invoices and update selectedInvoice
      await fetchInvoices()
      const updatedInvoice = invoices.find(
        invoice => invoice.idhoadon === selectedInvoice.idhoadon
      )
      setSelectedInvoice(updatedInvoice)
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Xóa dịch vụ thất bại!')
    }
  }

  const calculateTotalServicePrice = () => {
    if (!selectedInvoice) return 0

    const totalDouong = selectedInvoice.douong.reduce(
      (total, item) => total + item.thanhtien,
      0
    )
    const totalDothue = selectedInvoice.dothue.reduce(
      (total, item) => total + item.thanhtien,
      0
    )

    return totalDouong + totalDothue
  }

  const handlePayment = async () => {
    if (!selectedInvoice) {
      alert('Vui lòng chọn hóa đơn trước khi thanh toán.')
      return
    }

    const requestBody = {
      phuphi: phuPhi,
      method,
      ...(method === 'tiền mặt'
        ? { tienkhachtra: tienKhachTra, tienthua: tienThua }
        : {}),
      ...(method === 'chuyển khoản'
        ? { sotaikhoan: soTaiKhoan, nganhang: nganHang }
        : {})
    }

    try {
      const idbooking = selectedInvoice.booking._id
      console.log(idbooking)
      await axios.post(
        `http://localhost:8080/posthoadon/${selectedInvoice.idhoadon}/${idbooking}`,
        requestBody
      )
      alert('Thanh toán thành công!')
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Thanh toán thất bại!')
    }
  }

  return (
    <div className='thanh-toan-nhanh-container'>
      <h2 className='title'>Danh Sách Hóa Đơn Thanh Toán</h2>
      <div className='content'>
        {/* Invoice List */}
        <div className='invoice-list'>
          <h3>Danh Sách Hóa Đơn</h3>
          <input
            type='text'
            placeholder='Tìm kiếm theo số điện thoại'
            className='search-bar'
          />
          <table className='invoice-table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên khách</th>
                <th>Số điện thoại</th>
                <th>Sân ca</th>
                <th>Thời gian</th>
                <th>Ngày đặt lịch</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr
                  key={invoice.idhoadon}
                  onClick={() => handleInvoiceSelect(invoice)}
                >
                  <td>{index + 1}</td>
                  <td>{invoice.booking.hovaten}</td>
                  <td>{invoice.booking.phone}</td>
                  <td>{`${invoice.booking.loaisanbong} - ${invoice.booking.ca}`}</td>
                  <td>{`${invoice.booking.begintime} - ${invoice.booking.endtime}`}</td>
                  <td>{invoice.booking.ngayda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Used Services */}
        <div className='used-services'>
          <h3>Dịch Vụ Sử Dụng</h3>
          <button onClick={() => setIsModalOpen(true)}>Thêm Dịch Vụ</button>
          <div className='services-list'>
            {selectedInvoice && (
              <>
                {selectedInvoice.douong
                  .concat(selectedInvoice.dothue)
                  .map(service => (
                    <div key={service._id} className='service-item'>
                      <img
                        className='service-image'
                        src={service.image}
                        alt={
                          service.type === 'drink'
                            ? service.tendouong
                            : service.tendothue
                        }
                      />
                      <h4>
                        {service.type === 'drink'
                          ? service.tendouong
                          : service.tendothue}
                      </h4>
                      <p>Số lượng đã chọn: {service.soluong}</p>
                      <button onClick={() => handleRemoveService(service._id)}>
                        Xóa
                      </button>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
        {/* Payment Summary */}
        <div className='payment-summary'>
          <h3>Thanh Toán</h3>

          <div className='summary-item'>
            <label>Tên khách hàng</label>
            <h4>
              {selectedInvoice?.booking?.hovaten} SĐT{' '}
              {selectedInvoice?.booking?.phone}
            </h4>
          </div>

          <div className='summary-item'>
            <label>
              {selectedInvoice?.booking?.loaisanbong} -{' '}
              {selectedInvoice?.booking?.ca}
            </label>
          </div>

          <div className='summary-item'>
            <label>Tiền Sân</label>
            <input
              type='number'
              value={selectedInvoice?.booking?.giaca || 0}
              readOnly
            />
          </div>

          <div className='summary-item'>
            <label>Tiền Dịch Vụ</label>
            <input
              type='number'
              value={calculateTotalServicePrice()}
              readOnly
            />
          </div>

          <div className='summary-item'>
            <label>Tổng Tiền</label>
            <input type='number' value={selectedInvoice?.tongtien} readOnly />
          </div>

          <input
            type='number'
            value={phuPhi}
            onChange={e => {
              // Đảm bảo giá trị phụ phí không âm
              const newPhuPhi = Math.max(0, e.target.value)
              setPhuPhi(newPhuPhi)
            }}
          />

          <div className='summary-item'>
            <label>Hình Thức Thanh Toán</label>
            <select value={method} onChange={e => setMethod(e.target.value)}>
              <option value=''>Chọn phương thức</option>
              <option value='tiền mặt'>Tiền mặt</option>
              <option value='chuyển khoản'>Chuyển khoản</option>
            </select>
          </div>

          {method === 'tiền mặt' && (
            <>
              <div className='summary-item'>
                <label>Tiền Khách Trả</label>
                <input
                  type='number'
                  value={tienKhachTra}
                  onChange={e => setTienKhachTra(e.target.value)}
                />
              </div>

              <div className='summary-item'>
                <label>Tiền Thừa</label>
                <input
                  type='number'
                  value={tienKhachTra - (selectedInvoice?.tongtien + phuPhi)}
                  readOnly
                />
              </div>
            </>
          )}

          {method === 'chuyển khoản' && (
            <>
              <div className='summary-item'>
                <label>Số Tài Khoản</label>
                <input
                  type='text'
                  value={soTaiKhoan}
                  onChange={e => setSoTaiKhoan(e.target.value)}
                />
              </div>

              <div className='summary-item'>
                <label>Ngân Hàng</label>
                <input
                  type='text'
                  value={nganHang}
                  onChange={e => setNganHang(e.target.value)}
                />
              </div>
            </>
          )}

          <button className='pay-button' onClick={handlePayment}>
            Xác Nhận Thanh Toán
          </button>
        </div>

        {/* Modal for Service Selection */}
        {isModalOpen && (
          <div className='modal'>
            <div className='modal-content'>
              <h3>Chọn Dịch Vụ</h3>
              <button
                className='close-modal'
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
              <div className='services-grid'>
                {services.map(service => (
                  <div key={service._id} className='modal-service-item'>
                    <img
                      className='modal-service-image'
                      src={service.image}
                      alt={
                        service.type === 'drink'
                          ? service.tendouong
                          : service.tendothue
                      }
                    />
                    <h4>
                      {service.type === 'drink'
                        ? service.tendouong
                        : service.tendothue}
                    </h4>
                    <p>{service.price.toLocaleString()} VND</p>
                    <input
                      type='number'
                      min='1'
                      max={service.soluong}
                      placeholder='Số lượng'
                      onChange={e => (service.soluong = e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleServiceSelect(service, service.soluong)
                      }
                    >
                      Thêm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThanhToanNhanh
