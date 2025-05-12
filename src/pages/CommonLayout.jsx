import React from 'react'
import Sidebar from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'

const CommonLayout = () => {
  return (
    <div className='flex w-screen h-screen'>
      <Sidebar/>
      <div className="w-4/5 p-5">
        <Outlet/>
      </div>
    </div>
  )
}

export default CommonLayout
