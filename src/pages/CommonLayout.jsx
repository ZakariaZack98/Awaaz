import React, { useEffect, useState } from 'react'
import Sidebar from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Unverified from './Error/Unverified'

const CommonLayout = () => {
  const auth = getAuth();
  const [userVerified, setuserVerifed] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setuserVerifed(user.emailVerified)
    });
  }, [])

  return (
    <div className='flex w-screen h-screen'>
      {userVerified ? (
        <>
          <Sidebar />
          <div className="w-4/5 p-5">
            <Outlet />
          </div>
        </>
      ) : <Unverified/>}
    </div>
  )
}

export default CommonLayout
