// MenuStatusNhanVienContext.js
import React, { createContext, useState } from 'react'

export const MenuStatusNhanVienContext = createContext()

export const MenuStatusProvider = ({children}) => {
  const [menuStatusData, setMenuStatusData] = useState({})

  return (
    <MenuStatusNhanVienContext.Provider
      value={{ menuStatusData, setMenuStatusData }}
    >
      {children}
    </MenuStatusNhanVienContext.Provider>
  )
}
