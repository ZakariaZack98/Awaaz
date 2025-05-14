import React from 'react'

const BtnPrimary = ({label, colorClass = 'bg-blue-500', clickHandler}) => {
  return (
    <button className={`px-5 py-1 text-white cursor-pointer hover:bg-blue-800 duration-200 ${colorClass}`} onClick={clickHandler}>
      {label}
    </button>
  )
}

export default BtnPrimary
