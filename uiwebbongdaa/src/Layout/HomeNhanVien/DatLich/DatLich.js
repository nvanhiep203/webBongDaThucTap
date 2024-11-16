/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react'
import FilterBar from '../../../components/FilterBar'
import ShiftCard from '../../../components/ShiftCard'
import MenuStatusNhanVien from '../../../components/MenuStatusNhanVien'
import { MenuStatusNhanVienContext } from '../../../components/MenuStatusNhanVienContext'
import { useLocation } from 'react-router-dom'

import './DatLich.scss'

const DatLich = () => {
  const { menuStatusData } = useContext(MenuStatusNhanVienContext)
  const [shifts, setShifts] = useState([])
  const location = useLocation()
  const [datadatlich, setdatadatlich] = useState([])

  const userId = location.state?.userId || ''

  const fetchsanbong = async () => {
    try {
      const response = await fetch(`http://localhost:8080/getallsanbong`)
      if (response.ok) {
        const data = await response.json()
        setShifts(data)
      } else {
        console.log('đã xảy ra lỗi')
      }
    } catch (error) {
      console.error('Error fetching shifts:', error)
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

  useEffect(() => {
    fetchsanbong()
    fetchdatlich()
  }, [])

  useEffect(() => {
    if (Array.isArray(menuStatusData) && menuStatusData.length > 0) {
      setShifts(menuStatusData)
    }
  }, [menuStatusData])

  return (
    <div className='booking-screen'>
      <MenuStatusNhanVien />
      <FilterBar
        datadatlich={datadatlich}
        setdatadatlich={setdatadatlich}
        userId={userId}
        fetchdatlich={fetchdatlich}
      />

      <div className='shift-list'>
        {shifts.map((shift, index) => (
          <div className='divshifttong'>
            <div>
              <h2>{shift.tensan}</h2>
            </div>
            <ShiftCard key={index} shift={shift} fetchdatlich={fetchdatlich} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DatLich
