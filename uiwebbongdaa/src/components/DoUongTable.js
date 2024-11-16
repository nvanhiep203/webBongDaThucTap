import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const DoUongTable = () => {
  const [rentals, setRentals] = useState([]) // Lưu trữ danh sách đồ uống
  const [modalIsOpen, setModalIsOpen] = useState(false) // Trạng thái modal
  const [currentRental, setCurrentRental] = useState(null) // Lưu thông tin đồ uống hiện tại (dùng khi sửa)


  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getdouong')
      console.log('Danh sách đồ uống:', response.data)
      setRentals(response.data) 
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đồ uống:', error)
    }
  }


  const openModal = (rental = null) => {
    setCurrentRental(rental) 
    setModalIsOpen(true)
  }


  const closeModal = () => {
    setModalIsOpen(false)
    setCurrentRental(null)
  }

  // Xử lý thay đổi trong form nhập liệu
  const handleInputChange = e => {
    const { name, value } = e.target
    setCurrentRental({
      ...currentRental,
      [name]: value
    })
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      formData.append('tendouong', currentRental.tendouong)
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
          `http://localhost:8080/putdouong/${currentRental._id}`,
          formData,
          config
        )
        console.error(currentRental._id)
      } else {
        await axios.post('http://localhost:8080/postdouong', formData, config)
      }

      fetchRentals()
      closeModal()
      alert('Cập nhật thành công!')
    } catch (error) {
      console.error('Lỗi khi thêm/sửa đồ uống:', error)
      alert('Đã xảy ra lỗi, vui lòng thử lại!')
    }
  }

  // Xóa đồ uống
const handleDelete = async (id) => {
  try {
    console.log('Đang xóa đồ uống với ID:', id); // Debug ID đang xóa
    await axios.post(`http://localhost:8080/deletedouong/${id}`); 
    fetchRentals(); // Cập nhật lại danh sách đồ uống sau khi xóa thành công
    alert('Đã xóa đồ uống thành công!');
  } catch (error) {
    console.error('Lỗi khi xóa đồ uống:', error);
    alert('Đã xảy ra lỗi khi xóa!');
  }
};


  // Hiển thị chi tiết đồ uống
  const handleViewDetails = rental => {
    alert(
      `Chi tiết đồ uống: \nTên: ${rental.tendouong}\nSố lượng: ${rental.soluong}\nGiá: ${rental.price}\nẢnh: ${rental.image}`
    )
  }

  useEffect(() => {
    fetchRentals() // Lấy danh sách đồ uống khi component được mount
  }, [])

  return (
    <div>
      <button onClick={() => openModal()}>Thêm đồ uống</button>
      <h2>Danh sách đồ uống</h2>
      <table>
        <thead>
          <tr>
            <th>Tên đồ uống</th>
            <th>Ảnh</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rentals && rentals.length > 0 ? (
            rentals.map(rental => (
              <tr key={rental._id}>
                <td>{rental.tendouong}</td>
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
              <td colSpan='4'>Chưa có đồ uống</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
<h2>
  {currentRental && currentRental._id ? 'Sửa đồ uống' : 'Thêm đồ uống mới'}
</h2>
        <form>
          <div>
            <label>Tên đồ uống</label>
            <input
              type='text'
              name='tendouong'
              value={currentRental ? currentRental.tendouong : ''}
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
          {currentRental && currentRental._id
 ? 'Cập nhật' : 'Thêm'}
        </button>
        <button onClick={closeModal}>Đóng</button>
      </Modal>
    </div>
  )
}

export default DoUongTable
