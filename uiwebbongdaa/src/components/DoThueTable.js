import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const DoThueTable = () => {
  const [rentals, setRentals] = useState([]) // Lưu trữ danh sách đồ thuê
  const [modalIsOpen, setModalIsOpen] = useState(false) // Trạng thái modal
  const [currentRental, setCurrentRental] = useState(null) // Lưu thông tin đồ thuê hiện tại (dùng khi sửa)

  // Lấy danh sách đồ thuê từ server
  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getdothue')
      console.log('Danh sách đồ thuê:', response.data) // Kiểm tra dữ liệu nhận được từ API
      setRentals(response.data) // Cập nhật lại state với dữ liệu từ API
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đồ thuê:', error)
    }
  }

  // Mở modal để thêm đồ thuê
  const openModal = (rental = null) => {
    setCurrentRental(rental) // Cập nhật đồ thuê hiện tại (để sửa hoặc thêm mới)
    setModalIsOpen(true)
  }

  // Đóng modal
  const closeModal = () => {
    setModalIsOpen(false)
    setCurrentRental(null) // Reset lại khi đóng modal
  }

  // Xử lý thay đổi trong form nhập liệu
  const handleInputChange = e => {
    const { name, value } = e.target
    setCurrentRental({
      ...currentRental,
      [name]: value
    })
  }

  // Thêm đồ thuê mới hoặc sửa đồ thuê
  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('tendothue', currentRental.tendothue)
      formData.append('soluong', currentRental.soluong)
      formData.append('price', currentRental.price)

      if (currentRental.imageFile) {
        formData.append('image', currentRental.imageFile)
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }

      if (currentRental._id) {
        await axios.post(
          `http://localhost:8080/putdothue/${currentRental._id}`,
          formData,
          config
        )
        console.error(currentRental._id)
      } else {
        await axios.post('http://localhost:8080/postdothue', formData, config)
      }

      fetchRentals()
      closeModal()
      alert('Cập nhật thành công!')
    } catch (error) {
      console.error('Lỗi khi thêm/sửa đồ thuê:', error)
      alert('Đã xảy ra lỗi, vui lòng thử lại!')
    }
  }

  // Xóa đồ thuê
  const handleDelete = async id => {
    try {
      console.log('Đang xóa đồ thuê với ID:', id) // Debug ID đang xóa
      await axios.post(`http://localhost:8080/deletedothue/${id}`)
      fetchRentals() // Cập nhật lại danh sách đồ thuê
      alert('Đã xóa đồ thuê thành công!')
    } catch (error) {
      console.error('Lỗi khi xóa đồ thuê:', error)
      alert('Đã xảy ra lỗi khi xóa!')
    }
  }

  // Hiển thị chi tiết đồ thuê
  const handleViewDetails = rental => {
    alert(
      `Chi tiết đồ thuê: \nTên: ${rental.tendothue}\nSố lượng: ${rental.soluong}\nGiá: ${rental.price}\nẢnh: ${rental.image}`
    )
  }

  useEffect(() => {
    fetchRentals() // Lấy danh sách đồ thuê khi component được mount
  }, [])

  return (
    <div>
      <button onClick={() => openModal()}>Thêm đồ thuê</button>
      <h2>Danh sách đồ thuê</h2>
      <table>
        <thead>
          <tr>
            <th>Tên đồ thuê</th>
            <td>Ảnh</td>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rentals && rentals.length > 0 ? (
            rentals.map(rental => (
              <tr key={rental._id}>
                <td>{rental.tendothue}</td>
                <td>
                  <img src={rental.image} alt='' style={{ width: '50px' }} />
                </td>
                <td>{rental.soluong}</td>
                <td>{rental.price.toLocaleString()} VNĐ</td>

                <td>
                  <button onClick={() => openModal(rental)}>Sửa</button>
                  <button onClick={() => handleDelete(rental._id)}>Xóa</button>
                  <button onClick={() => handleViewDetails(rental)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4'>Chưa có đồ thuê</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>
          {currentRental && currentRental._id
            ? 'Sửa đồ thuê'
            : 'Thêm đồ thuê mới'}
        </h2>
        <form>
          <div>
            <label>Tên đồ thuê</label>
            <input
              type='text'
              name='tendothue'
              value={currentRental ? currentRental.tendothue : ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Số lượng</label>
            <input
              type='number'
              name='soluong'
              value={currentRental ? currentRental.soluong : ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Giá</label>
            <input
              type='number'
              name='price'
              value={currentRental ? currentRental.price : ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Ảnh</label>
            <input
              type='file'
              name='image'
              onChange={e =>
                setCurrentRental({
                  ...currentRental,
                  imageFile: e.target.files[0] // lưu trữ file trong state
                })
              }
            />
          </div>
        </form>
        <button onClick={handleSubmit}>
          {currentRental && currentRental._id ? 'Cập nhật' : 'Thêm'}
        </button>
        <button onClick={closeModal}>Đóng</button>
      </Modal>
    </div>
  )
}

export default DoThueTable
