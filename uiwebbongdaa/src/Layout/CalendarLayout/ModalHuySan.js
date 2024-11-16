function ModalHuySan ({ userId, idbooking, isOpen, onClose, fetchdata }) {
  const handleHuySan = async () => {
    try {
      const response = await fetch(`http://localhost:8080/huysan/${idbooking}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        alert('Hủy sân thành công')
        fetchdata()
        onClose()
      }
    } catch (error) {
      alert('đã xảy ra lỗi')
      console.log(error)
    }
  }
  if (!isOpen) {
    return null
  }
  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Hủy sân</h2>
        <p>Hủy sân mất cọc</p>
        <p>Bạn có muốn hủy sân</p>
        <button onClick={handleHuySan}>Hủy sân</button>
      </div>
    </div>
  )
}

export default ModalHuySan
