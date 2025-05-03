import React from 'react'
import Freezer from '../components/Freezer'
import FreezerCarousel from '../components/FreezersCarousel'

function Dashboard() {
  return (
    <div className='h-screen flex items-center justify-center flex-col text-center'>
        <FreezerCarousel />
    </div>
  )
}

export default Dashboard