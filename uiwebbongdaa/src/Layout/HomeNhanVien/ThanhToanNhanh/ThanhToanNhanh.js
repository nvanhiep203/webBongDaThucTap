import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ThanhToanNhanh.scss';

const ThanhToanNhanh = () => {
  const [invoices, setInvoices] = useState([]); // List of invoices from API
  const [services, setServices] = useState([]); // List of drinks from API
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [usedServices, setUsedServices] = useState([]); // Selected services for invoice
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchInvoices();
    fetchServices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/checkin');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getdouong');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceSelect = (service) => {
    setUsedServices((prev) => [...prev, { ...service, soluong: 1 }]);
    setIsModalOpen(false); // Close modal after selection
  };

  const calculateTotalServicePrice = () => {
    return usedServices.reduce((total, service) => total + service.price * service.soluong, 0);
  };

  return (
    <div className="thanh-toan-nhanh-container">
      <h2 className="title">Danh Sách Hóa Đơn Thanh Toán</h2>
      <div className="content">
        
        {/* Invoice List */}
        <div className="invoice-list">
          <h3>Danh Sách Hóa Đơn</h3>
          <input type="text" placeholder="Tìm kiếm theo số điện thoại" className="search-bar" />
          <table className="invoice-table">
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
                <tr key={invoice._id} onClick={() => setSelectedInvoice(invoice)}>
                  <td>{index + 1}</td>
                  <td>{invoice.hovaten}</td>
                  <td>{invoice.phone}</td>
                  <td>{`${invoice.loaisanbong} - ${invoice.ca}`}</td>
                  <td>{`${invoice.begintime} - ${invoice.endtime}`}</td>
                  <td>{invoice.ngayda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Information */}
        <div className="invoice-info">
          <h3>Thông Tin Hóa Đơn</h3>
          <div className="info-group">
            <label>Tên Khách Hàng</label>
            <input type="text" value={selectedInvoice?.hovaten || ''} readOnly />
          </div>
          {/* Add other invoice fields here */}
        </div>

        {/* Used Services */}
        <div className="used-services">
          <h3>Dịch Vụ Sử Dụng</h3>
          <button onClick={() => setIsModalOpen(true)}>Thêm Dịch Vụ</button>
          <div className="services-list">
            {usedServices.map((service) => (
              <div key={service._id} className="service-card">
                <img src={service.image} alt={service.tendouong} />
                <h4>{service.tendouong}</h4>
                <p>{service.price.toLocaleString()} VND</p>
                <input
                  type="number"
                  value={service.soluong}
                  min="0"
                  onChange={(e) =>
                    setUsedServices((prev) =>
                      prev.map((s) =>
                        s._id === service._id ? { ...s, soluong: parseInt(e.target.value) } : s
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Modal for selecting additional services */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chọn Dịch Vụ</h3>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
              {services.map((service) => (
                <div key={service._id} className="modal-service-item">
                  <img src={service.image} alt={service.tendouong} />
                  <h4>{service.tendouong}</h4>
                  <p>{service.price.toLocaleString()} VND</p>
                  <button onClick={() => handleServiceSelect(service)}>Chọn</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Summary */}
        <div className="payment-summary">
          <h3>Thanh Toán</h3>
          <div className="summary-item">
            <label>Giá Dịch Vụ</label>
            <input type="number" value={calculateTotalServicePrice()} readOnly />
          </div>
          <button className="pay-button">Xác Nhận Thanh Toán</button>
        </div>
      </div>
    </div>
  );
};

export default ThanhToanNhanh;
