import React, { useState, useEffect } from 'react'
import './SanbongTable.scss'

function SanbongTable () {
  const [fieldTypes, setFieldTypes] = useState([])
  const [fields, setFields] = useState([])
  const [showAddFieldTypeForm, setShowAddFieldTypeForm] = useState(false)
  const [showAddFieldForm, setShowAddFieldForm] = useState(false)
  const [tenLoaiSan, setTenLoaiSan] = useState('')
  const [selectedLoaiSan, setSelectedLoaiSan] = useState('')
  const [tenSan, setTenSan] = useState('')
  const [trangThai, setTrangThai] = useState('binh thuong')
  const [filteredFields, setFilteredFields] = useState([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentFieldId, setCurrentFieldId] = useState(null)
  const [newFieldName, setNewFieldName] = useState('')
  useEffect(() => {
    const fetchFieldTypes = async () => {
      try {
        const fieldTypesResponse = await fetch(
          'http://localhost:8080/getloaisanbong'
        )
        if (fieldTypesResponse.ok) {
          const fieldTypesData = await fieldTypesResponse.json()
          setFieldTypes(fieldTypesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    const fetchFields = async () => {
      try {
        const fieldsResponse = await fetch('http://localhost:8080/getfullsan')
        if (fieldsResponse.ok) {
          const fieldsData = await fieldsResponse.json()
          setFields(fieldsData)
          setFilteredFields(fieldsData)
        }
      } catch (error) {
        console.error('Error fetching fields:', error)
      }
    }

    fetchFields()
    fetchFieldTypes()
  }, [])

  const handleFilterByFieldType = async selectedFieldType => {
    setSelectedLoaiSan(selectedFieldType)

    if (selectedFieldType === 'all') {
      setFilteredFields(fields)
    } else {
      try {
        const response = await fetch('http://localhost:8080/getsantheoloai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tenloaisan: selectedFieldType })
        })

        if (response.ok) {
          const filteredFieldsData = await response.json()
          setFilteredFields(filteredFieldsData)
        } else {
          alert('Không tìm thấy sân cho loại sân này!')
        }
      } catch (error) {
        console.error('Error fetching filtered fields:', error)
      }
    }
  }

  const handleAddFieldType = async () => {
    if (tenLoaiSan.trim() === '') {
      alert('Tên loại sân không được để trống!')
      return
    }
    try {
      const response = await fetch('http://localhost:8080/postloaisanbong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tenloaisan: tenLoaiSan })
      })
      if (response.ok) {
        const newFieldType = await response.json()
        setFieldTypes([...fieldTypes, newFieldType])
        setShowAddFieldTypeForm(false)
        setTenLoaiSan('')
      } else {
        alert('Thêm loại sân thất bại')
      }
    } catch (error) {
      console.error('Error adding field type:', error)
    }
  }

  const handleAddField = async () => {
    if (tenSan.trim() === '' || selectedLoaiSan.trim() === '') {
      alert('Tên sân và loại sân không được để trống!')
      return
    }
    try {
      const response = await fetch('http://localhost:8080/postsanbong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maloaisan: fieldTypes.find(
            type => type.tenloaisan === selectedLoaiSan
          )?.maloaisan,
          tensan: tenSan,
          trangthai: trangThai
        })
      })
      if (response.ok) {
        const newField = await response.json()
        setFields([...fields, newField])
        setFilteredFields([...fields, newField])
        setShowAddFieldForm(false)
        setTenSan('')
        setSelectedLoaiSan('')
        setTrangThai('binh thuong')
      } else {
        alert('Thêm sân thất bại')
      }
    } catch (error) {
      console.error('Error adding field:', error)
    }
  }
  const openEditDialog = field => {
    setCurrentFieldId(field._id) // Lưu ID của sân hiện tại để sửa
    setNewFieldName(field.tensan) // Lưu tên sân hiện tại để hiển thị trong hộp thoại sửa
    setShowEditDialog(true)
  }

  // Handle edit field
  const handleEditField = async () => {
    if (newFieldName === '') {
      alert('Tên sân không được để trống!')
      return
    }
    try {
      const response = await fetch(
        `http://localhost:8080/putsanbong/${currentFieldId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tensan: newFieldName })
        }
      )

      if (response.ok) {
        const updatedField = await response.json()
        setFields(prev =>
          prev.map(field =>
            field._id === currentFieldId
              ? { ...field, tensan: updatedField.tensan }
              : field
          )
        )
        setFilteredFields(prev =>
          prev.map(field =>
            field._id === currentFieldId
              ? { ...field, tensan: updatedField.tensan }
              : field
          )
        )
        setShowEditDialog(false)
        setCurrentFieldId(null)
        setNewFieldName('')
      } else {
        alert('Sửa sân thất bại')
      }
    } catch (error) {
      console.error('Error editing field:', error)
    }
  }

  // Handle delete field
  const handleDeleteField = async _id => {
    try {
      const response = await fetch(
        `http://localhost:8080/deletesanbong/${_id}`,
        {
          method: 'POST'
        }
      )
      if (response.ok) {
        setFilteredFields(filteredFields.filter(field => field._id !== _id))
      } else {
        alert('Xóa sân thất bại')
      }
    } catch (error) {
      console.error('Error deleting field:', error)
    }
  }

  return (
    <div className='field-table'>
      <h3>Quản Lý Loại Sân Và Sân Bóng</h3>
      <button onClick={() => setShowAddFieldTypeForm(true)}>
        Thêm Loại Sân
      </button>
      <button onClick={() => setShowAddFieldForm(true)}>Thêm Sân Bóng</button>

      {showAddFieldTypeForm && (
        <div className='add-form'>
          <h4>Thêm Loại Sân Mới</h4>
          <input
            type='text'
            placeholder='Tên loại sân'
            value={tenLoaiSan}
            onChange={e => setTenLoaiSan(e.target.value)}
          />
          <button onClick={handleAddFieldType}>Xác nhận</button>
          <button onClick={() => setShowAddFieldTypeForm(false)}>Hủy</button>
        </div>
      )}

      {showAddFieldForm && (
        <div className='add-form'>
          <h4>Thêm Sân Bóng Mới</h4>
          <select
            value={selectedLoaiSan}
            onChange={e => setSelectedLoaiSan(e.target.value)}
          >
            <option value=''>Chọn loại sân</option>
            {fieldTypes.map((type, index) => (
              <option key={index} value={type.tenloaisan}>
                {type.tenloaisan}
              </option>
            ))}
          </select>
          <input
            type='text'
            placeholder='Tên sân'
            value={tenSan}
            onChange={e => setTenSan(e.target.value)}
          />
          <select
            value={trangThai}
            onChange={e => setTrangThai(e.target.value)}
          >
            <option value='binh thuong'>Bình thường</option>
            <option value='dang sua'>Đang sửa</option>
          </select>
          <button onClick={handleAddField}>Xác nhận</button>
          <button onClick={() => setShowAddFieldForm(false)}>Hủy</button>
        </div>
      )}
      {showEditDialog && (
        <div className='edit-dialog'>
          <h4>Sửa Tên Sân</h4>
          <input
            type='text'
            placeholder='Tên sân mới'
            value={newFieldName}
            onChange={e => setNewFieldName(e.target.value)}
          />
          <button onClick={handleEditField}>Lưu</button>
          <button onClick={() => setShowEditDialog(false)}>Hủy</button>
        </div>
      )}
      <div>
        <h4>Lọc Sân Theo Loại</h4>
        <select onChange={e => handleFilterByFieldType(e.target.value)}>
          <option value='all'>Tất cả</option>
          {fieldTypes.map((type, index) => (
            <option key={index} value={type.tenloaisan}>
              {type.tenloaisan}
            </option>
          ))}
        </select>
      </div>

      <div className='table-container'>
        <h4>Danh Sách Sân Bóng</h4>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại Sân</th>
              <th>Tên Sân</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.map((field, index) => (
              <tr key={field._id}>
                <td>{index + 1}</td>
                <td>{field._id}</td>
                <td>{field.tensan}</td>
                <td>{field.trangthai}</td>
                <td>
                  <button onClick={() => openEditDialog(field)}>Sửa</button>

                  <button onClick={() => handleDeleteField(field._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SanbongTable
